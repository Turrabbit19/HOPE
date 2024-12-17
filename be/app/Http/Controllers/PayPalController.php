<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailJob;
use App\Models\CourseSemester;
use App\Models\Student;
use App\Models\StudentMajor;
use App\Models\StudentSchedule;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Payment;
use Illuminate\Support\Facades\Auth;

class PayPalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'payment_id' => 'required|string',
            'amount' => 'required|numeric',
            'currency' => 'string',
            'semester' => 'required|integer',
        ]);

        $transaction = new Transaction();
        $transaction->student_id = $validated['user_id'];
        $transaction->payment_id = $validated['payment_id'];
        $transaction->amount = $validated['amount'];
        $transaction->currency = $validated['currency'];
        $transaction->semester = $validated['semester'];
        $transaction->save();
        $user = User::find($validated['user_id']);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Student not found']);
        }

        $userEmail = $user->email;
        SendEmailJob::dispatch($userEmail, 'Đây là email đăng ký thành công', "Không có gì để nói cả");
        return response()->json($userEmail, 200);
    }

    public function checkTuitionFee(Request $request)
    {
        $major = $request->input('major');
        $course = $request->input('course');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        $tuitionFees = Transaction::where('major_id', $major)
            ->where('course_id', $course)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        if ($tuitionFees->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học phí phù hợp với các tiêu chí tìm kiếm.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $tuitionFees
        ]);
    }
    public function getTransactionsByCourse(Request $request)
    {
        $course_id = $request->input('course');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        // Kiểm tra và chuyển đổi startDate, endDate nếu có
        if ($startDate) {
            $startDate = Carbon::parse($startDate)->startOfDay();
        }
        if ($endDate) {
            $endDate = Carbon::parse($endDate)->endOfDay();
        }

        $transactions = Transaction::with([
            'student.user' => function ($query) {
                $query->select('id', 'name');
            }
        ])
            ->when($course_id, function ($query) use ($course_id) {
                return $query->whereHas('student', function ($query) use ($course_id) {
                    $query->where('course_id', $course_id);
                });
            })
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->get()
            ->each(function ($transaction) {
                $transaction->student->makeHidden(['id', 'user_id', 'course_id', 'created_at', 'updated_at', 'status', 'deleted_at']);

                $transaction->student->name = $transaction->student->user->name;
                $transaction->student->makeHidden(['user']);

                $transaction->makeHidden(['updated_at']);
            });

        return response()->json($transactions);
    }


    public function getFeeBySemester()
    {
        $user = Auth::user();

        $student = Student::where('user_id', $user->id)->firstOrFail();

        $fee = Transaction::where('user_id', $user->id)->firstOrFail();
        $feeDate = Carbon::parse($fee->created_at);
        $currentCourseSemester = CourseSemester::where('course_id', $student->course_id)
            ->where('order', $student->current_semester + 1)
            ->join('semesters', 'semesters.id', '=', 'course_semesters.semester_id')
            ->select('semesters.start_date', 'semesters.end_date')
            ->first();
        if (!$currentCourseSemester) {
            return response()->json(['error' => 'Không tìm thấy thông tin kỳ học.'], 404);
        }
        $startDate = Carbon::parse($currentCourseSemester->start_date);
        $registrationStart = $startDate->copy()->subDays(10);
        $registrationEnd = $registrationStart->copy()->addDays(3);
        $now = Carbon::now();

        if ($feeDate->between($startDate->copy()->subDays(10), $startDate->copy()->subDays(3))) {
            return response()->json("Bạn đã nộp học phí trong kỳ " . $fee->semester . " rồi !!!", 200);
        }

        if ($now->lt($registrationStart)) {
            return response()->json(['error' => 'Thời gian nộp học phí chưa bắt đầu.'], 405);
        }

        if ($now->gt($registrationEnd)) {
            return response()->json(['error' => 'Đã kết thúc ngày nộp học phí. Nếu chưa nộp vui lòng liên hệ phòng hỗ trợ Sinh Viên'], 403);
        }

        $registeredSubjects = StudentSchedule::where('student_id', $student->id)
            ->join('schedules', 'schedules.id', '=', 'student_schedules.schedule_id')
            ->pluck('schedules.subject_id')
            ->toArray();

        $subjects = StudentMajor::where('student_majors.student_id', $student->id)
            ->join('majors', 'majors.id', '=', 'student_majors.major_id')
            ->join('major_subjects', 'major_subjects.major_id', '=', 'majors.id')
            ->join('subjects', 'subjects.id', '=', 'major_subjects.subject_id')
            ->where('subjects.order', $student->current_semester)
            ->whereNotIn('subjects.id', $registeredSubjects)
            ->select('subjects.id', 'subjects.code', 'subjects.name', 'subjects.credit')
            ->get();

        $totalCredit = $subjects->sum('credit');
        $totalPrice = $subjects->sum(function ($subject) {
            return $subject->credit * 330000;
        });

        return response()->json(['total_credit' => $totalCredit, 'price' => $totalPrice, 'order' => $student->current_semester + 1], 200);
    }

}
