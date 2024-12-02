<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailJob;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function sendEmail(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $email = $validatedData['email'];
        $subject = $validatedData['subject'];
        $message = $validatedData['message'];

        Mail::raw($message, function ($mail) use ($email, $subject) {
            $mail->to($email)
                ->subject($subject);
        });

        return response()->json(['success' => true, 'message' => 'Gửi mail thành công']);
    }
    public function sendEmailToTeacher(Request $request)
    {
        $validatedData = $request->validate([
            'major_id' => 'required|integer',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $majorId = $validatedData['major_id'];
        $subject = $validatedData['subject'];
        $message = $validatedData['message'];

        $emails = Teacher::where('major_id', $majorId)
            ->with('user')
            ->get()
            ->pluck('user.email')
            ->toArray();

        if (empty($emails)) {
            return response()->json(['success' => false, 'message' => 'Không có giảng viên nào trong ngành học này']);
        }


        if (empty($emails)) {
            return response()->json(['success' => false, 'message' => 'Không có giảng viên nào trong ngành học này']);
        }

        foreach ($emails as $email) {
            dispatch(new SendEmailJob($email, $subject, $message));
        }

        return response()->json(['success' => true, 'message' => 'Email đã được gửi đến tất cả giảng viên']);
    }
}
