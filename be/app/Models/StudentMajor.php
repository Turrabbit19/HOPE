<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentMajor extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'major_id',
        'status'
    ];

    public function major() {
        return $this->belongsTo(Major::class);
    }
}
