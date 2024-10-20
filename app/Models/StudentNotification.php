<?php

namespace App\Models;

use App\Models\Student;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentNotification extends Model
{
    use HasFactory;
 
    protected $table = 'student_notifications';

    protected $fillable = [
        'student_id',
        'notification_id',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
    public function notification()
    {
        return $this->belongsTo(Notification::class);
    }
}
