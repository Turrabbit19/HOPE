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

class NewNotification
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    public function broadcastOn()
    {
        return new Channel('broadcast-notification');
    }

    public function broadcastWith()
    {
        return [
            'section_id' => $this->notification->section_id,
            'course_id' => $this->notification->courses->map(function ($course){
                return [
                    "id" => $course->id,
                    "name" => $course->name,
                ];
            }),
            'name' => $this->notification->name,
            'description' => $this->notification->description,
            'time' => $this->notification->time,
        ];
    }
}
