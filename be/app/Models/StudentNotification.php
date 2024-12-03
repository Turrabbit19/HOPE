<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'notification_id',
        'status'
    ];

    public function student() {
        return $this->belongsTo(Student::class);
    }

    public function notification() {
        return $this->belongsTo(Notification::class);
    }
}
