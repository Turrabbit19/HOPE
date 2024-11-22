<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classroom extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'subject_id',
        'code',
        'max_students',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function subject() {
        return $this->belongsTo(Subject::class);
    }
    public function students() {
        return $this->belongsToMany(Student::class, 'student_classrooms');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

}
