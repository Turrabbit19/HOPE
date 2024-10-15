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

    public function sections() {
        return $this->belongsTo(Section::class);
    }

    public function notification_courses() {
        return $this->belongsToMany(Notification_Course::class);
    }
}