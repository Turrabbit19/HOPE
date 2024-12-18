<?php

namespace App\Http\Controllers;

use App\Models\CourseSemester;
use App\Models\Student;
use App\Models\StudentMajor;
use App\Models\StudentSchedule;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PayPalController extends Controller
{
    /**
     * Store a new transaction.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'payment_id' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'semester' => 'required|integer',
        ]);

        $transaction = Transaction::create($validated);
        $userEmail = User::findOrFail($validated['user_id'])->email;

        // Gửi email thông báo (nếu cần)
        // SendEmailJob::dispatch($userEmail, 'Nội dung email', 'Chi tiết thông báo');
        return response()->json(['email' => $userEmail], 200);
    }


    public function checkTuitionFee(Request $request)
    {
        $validated = $request->validate([
            'major' => 'required|integer|exists:majors,id',
            'course' => 'required|integer|exists:courses,id',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
        ]);

        $tuitionFees = Transaction::where('major_id', $validated['major'])
            ->where('course_id', $validated['course'])
            ->whereBetween('created_at', [$validated['startDate'], $validated['endDate']])
            ->get();

        if ($tuitionFees->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học phí phù hợp với các tiêu chí tìm kiếm.',
            ], 404);
        }

        return response()->json(['status' => 'success', 'data' => $tuitionFees], 200);
    }

    public function getTransactionsByCourse(Request $request)
    {
        $validated = $request->validate([
            'course' => 'nullable|integer|exists:courses,id',
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date|after_or_equal:startDate',
        ]);

        $transactions = Transaction::with('student.user:id,name')
            ->when($validated['course'] ?? null, function ($query, $course_id) {
                return $query->whereHas('student', fn($q) => $q->where('course_id', $course_id));
            })
            ->when(isset($validated['startDate'], $validated['endDate']), function ($query) use ($validated) {
                return $query->whereBetween('created_at', [
                    Carbon::parse($validated['startDate'])->startOfDay(),
                    Carbon::parse($validated['endDate'])->endOfDay(),
                ]);
            })
            ->get();

        $transactions->transform(function ($transaction) {
            $transaction->makeHidden(['updated_at']);
            $transaction->student->makeHidden(['id', 'user_id', 'course_id', 'status', 'deleted_at']);
            $transaction->student->name = $transaction->student->user->name;
            $transaction->student->makeHidden(['user']);
            return $transaction;
        });

        return response()->json($transactions, 200);
    }

    public function getFeeBySemester()
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->firstOrFail();
        $fee = Transaction::where('user_id', $user->id)->first();

        $semesterInfo = $this->getNextSemesterInfo($student->course_id, $student->current_semester);  // Kỳ học hiện tại

        if (!$semesterInfo) {
            return response()->json(['error' => 'Không tìm thấy thông tin kỳ học hiện tại.'], 404);
        }

        if ($student->current_semester == 1) {
            return response()->json("Bạn đã nộp học phí cho kỳ 1 rồi !!!", 200);
        }

        $registrationPeriod = $this->getRegistrationPeriod($semesterInfo->start_date);
        $now = Carbon::now();

        if ($fee && Carbon::parse($fee->created_at)->between($registrationPeriod['start'], $registrationPeriod['end'])) {
            if ($fee->semester == $student->current_semester) {
                return response()->json("Bạn đã nộp học phí trong kỳ " . $fee->semester . " rồi !!!", 200);
            } else {
                return response()->json("Bạn đã nộp học phí trong kỳ " . $fee->semester . " rồi. Cảm ơn bạn !!!", 200);
            }
        }

        if ($now->lt($registrationPeriod['start'])) {
            return response()->json(['error' => 'Thời gian nộp học phí chưa bắt đầu.'], 405);
        }

        if ($now->gt($registrationPeriod['end'])) {
            return response()->json([
                'error' => 'Đã kết thúc ngày nộp học phí. Nếu chưa nộp vui lòng liên hệ phòng hỗ trợ Sinh Viên.',
            ], 403);
        }

        $subjects = $this->getSubjectsForRegistration($student);
        $totalCredit = $subjects->sum('credit');
        $totalPrice = $subjects->sum(fn($subject) => $subject->credit * 330000);

        return response()->json([
            'total_credit' => $totalCredit,
            'price' => $totalPrice,
            'order' => $student->current_semester,
        ], 200);
    }


    private function getNextSemesterInfo($course_id, $nextSemesterOrder)
    {
        return CourseSemester::where('course_id', $course_id)
            ->where('order', $nextSemesterOrder)
            ->join('semesters', 'semesters.id', '=', 'course_semesters.semester_id')
            ->select('semesters.start_date', 'semesters.end_date')
            ->first();
    }

    private function getRegistrationPeriod($startDate)
    {
        $start = Carbon::parse($startDate)->subDays(10);
        $end = $start->copy()->addDays(3);
        return ['start' => $start, 'end' => $end];
    }

    private function getSubjectsForRegistration($student)
    {
        $registeredSubjects = StudentSchedule::where('student_id', $student->id)
            ->join('schedules', 'schedules.id', '=', 'student_schedules.schedule_id')
            ->pluck('schedules.subject_id')
            ->toArray();

        return StudentMajor::where('student_majors.student_id', $student->id)
            ->join('majors', 'majors.id', '=', 'student_majors.major_id')
            ->join('major_subjects', 'major_subjects.major_id', '=', 'majors.id')
            ->join('subjects', 'subjects.id', '=', 'major_subjects.subject_id')
            ->where('subjects.order', $student->current_semester)
            ->whereNotIn('subjects.id', $registeredSubjects)
            ->select('subjects.id', 'subjects.code', 'subjects.name', 'subjects.credit')
            ->get();
    }
}
