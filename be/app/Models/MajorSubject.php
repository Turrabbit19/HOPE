<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MajorSubject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'major_id',
        'subject_id',
        'semester_order',
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }
    public function major() {
        return $this->belongsTo(Major::class);
    }
    public function subject() {
        return $this->belongsTo(subject::class);
    }
}
