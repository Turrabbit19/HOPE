<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'section_id',
        'name',
        'description',
        'time',
    ];

    public function section() {
        return $this->belongsTo(Section::class);
    }
    public function courses() {
        return $this->belongsToMany(Course::class, 'notification_courses');
    }
}