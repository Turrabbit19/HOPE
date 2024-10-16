<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification_Course extends Model
{
    use HasFactory;

    protected $table = "notification_courses";

    protected $fillable = [
        'notification_id',
        'course_id',
    ];

    public function notifications() {
        return $this->belongsTo(Notification::class,'notification_courses');
    }

    public function courses() {
        return $this->belongsTo(Course::class);
    }
}
