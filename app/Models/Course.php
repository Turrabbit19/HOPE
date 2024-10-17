<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'plan_id',
        'start_date',
        'end_date',
        'status'
    ];

    public function notifications() {
        return $this->belongsToMany(Notification::class, 'notification_courses', 'course_id', 'notification_id');
    }
    public function plan() {
        return $this->belongsTo(Plan::class);
    }
}