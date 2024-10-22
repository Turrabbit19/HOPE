<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MajorSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'major_id',
        'subject_id',
    ];

    public function major() {
        return $this->belongsTo(Major::class);
    }
    public function subject() {
        return $this->belongsTo(Subject::class);
    }
}
