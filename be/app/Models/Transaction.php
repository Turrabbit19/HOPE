<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id', 'amount', 'currency', 'status', 'student_id', 'semester',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'user_id', 'user_id');
    }
}
