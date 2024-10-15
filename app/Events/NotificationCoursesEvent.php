<?php

namespace App\Events;

use App\Models\Notification_Course;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCoursesEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification_courses;

    public function __construct(Notification_Course $notification_courses)
    {
        $this->notification_courses = $notification_courses;
    }

    public function broadcastOn()
    {
        return new Channel('broadcast-notification-courses');
    }

    public function broadcastWith()
    {
        return [
            'notification_id' => $this->notification_courses->notification_id,
            'course_id' => $this->notification_courses->course_id,
        ];
    }
}
