<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Semester extends Model
{
    use HasFactory, SoftDeletes;
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
    public function subject()
    {
        return $this->hasMany(Subject::class );
    }

    protected $fillable = [
        'name',
        'number',
        'course_id',
        'start_date',
        'end_date',
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }
}