<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notifications;

    public function __construct(Notification $notifications)
    {
        $this->notifications = $notifications;
    }

    public function broadcastOn()
    {
        return new Channel('broadcast-notification');
    }

    public function broadcastWith()
    {
        return [
            'section_id' => $this->notifications->section_id,
            'name' => $this->notifications->name,
            'description' => $this->notifications->description,
            'time' => $this->notifications->time,
        ];
    }
}

