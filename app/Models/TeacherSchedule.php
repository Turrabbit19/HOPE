<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'schedule_id'
    ];

    public function teacher() 
    {
        return $this->belongsTo(Teacher::class);
    }

    public function schedule() 
    {
        return $this->belongsTo(Schedule::class);
    }
}
