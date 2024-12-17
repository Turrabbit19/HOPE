<?php

namespace App\Jobs;

use App\Services\RabbitMQService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RegisterClassJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $classId;
    protected $userId;

    public function __construct($classId, $userId)
    {
        $this->classId = $classId;
        $this->userId = $userId;
    }

    public function handle()
    {
        $rabbitMQService = new RabbitMQService();
        $rabbitMQService->sendMessageToQueue([
            'classId' => $this->classId,
            'userId' => $this->userId,
        ]);
    }
}
