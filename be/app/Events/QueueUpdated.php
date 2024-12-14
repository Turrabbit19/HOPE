<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class QueueUpdated implements ShouldBroadcast
{
    public $userId;
    public $waitCount;

    public function __construct($userId, $waitCount)
    {
        $this->userId = $userId;
        $this->waitCount = $waitCount;
    }

    public function broadcastOn()
    {
        return new Channel('queue');
    }
    public function broadcastWith()
    {
        return [
            'userId' => $this->userId,
            'waitCount' => $this->waitCount,
        ];
    }
}
