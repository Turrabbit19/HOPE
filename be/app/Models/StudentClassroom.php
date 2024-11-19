<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentClassroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'classroom_id',
        'study_date'
    ];


    public function student() {
        return $this->belongsTo(Student::class);
    }
    public function classroom() {
        return $this->belongsTo(Classroom::class);
    }
}
