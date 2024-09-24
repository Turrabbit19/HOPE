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

    protected $fillable = [
        'name',
        // 'number',
        'course_id',
        'start_date',
        'end_date',
    ];
}
