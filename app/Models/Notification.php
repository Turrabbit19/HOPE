<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "notifications";

    protected $casts = [
        'time' => 'datetime',
    ];

    protected $fillable = [
        'section_id',
        'name',
        'description',
        'time',
    ];

    public function sections() {
        return $this->belongsTo(Section::class , 'section_id');
    }

    public function notification_courses() {
        return $this->belongsToMany(Course::class, 'notification_courses', 'notification_id', 'course_id');
    }
}