<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Payment;

class PayPalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|integer',
            'payment_id' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        $transaction = new Transaction();
        $transaction->student_id = $validated['student_id'];
        $transaction->payment_id = $validated['payment_id'];
        $transaction->amount = $validated['amount'];
        $transaction->save();

        return response()->json(['success' => true, 'message' => 'Transaction saved successfully']);
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
        $major = $request->input('major');

        if ($startDate) {
            $startDate = Carbon::parse($startDate)->startOfDay();
        }
        if ($endDate) {
            $endDate = Carbon::parse($endDate)->endOfDay();
        }

        $transactions = Transaction::whereHas('student', function ($query) use ($course_id, $major) {
            $query->where('course_id', $course_id);
            if ($major) {
                $query->whereHas('majors', function ($query) use ($major) {
                    $query->where('major_id', $major);
                });
            }
        })
            ->with([
                'student.user' => function ($query) {
                    $query->select('id', 'name');
                }
            ])
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->get()
            ->each(function ($transaction) {
                $transaction->student->makeHidden(['id', 'user_id', 'course_id', 'created_at', 'updated_at', 'status', 'deleted_at']);

                $transaction->student->name = $transaction->student->user->name;
                $transaction->student->makeHidden(['user']);

                $transaction->makeHidden([ 'updated_at']);
            });

        return response()->json($transactions);
    }

}
