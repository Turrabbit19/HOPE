<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Mail;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $email;
    public $subject;
    public $message;
    /**
     * Create a new job instance.
     */
    public function __construct($email, $subject, $message)
    {
        $this->email = $email;
        $this->subject = $subject;
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::raw($this->message, function ($mail) {
                $mail->to($this->email)
                     ->subject($this->subject);
            });
        } catch (\Exception $e) {
            \Log::error('Error sending email to ' . $this->email . ': ' . $e->getMessage());
        }
    }
}
