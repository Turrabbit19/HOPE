<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PayPal\Api\Payment;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;

class PayPalController extends Controller
{

    // public function verifyPayment(Request $request)
    // {
    //     $paymentId = $request->input('id'); // ID của giao dịch PayPal
    //     try {
    //         $payment = Payment::get($paymentId, $this->apiContext);

    //         if ($payment->getState() === 'approved') {
    //             return response()->json(['success' => true, 'message' => 'Payment verified']);
    //         } else {
    //             return response()->json(['success' => false, 'message' => 'Payment not approved'], 400);
    //         }
    //     } catch (\Exception $e) {
    //         return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    //     }
    // }
}
