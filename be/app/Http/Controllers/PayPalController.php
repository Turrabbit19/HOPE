<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
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

}
