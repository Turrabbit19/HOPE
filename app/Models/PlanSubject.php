<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanSubject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'plan_id',
        'major_subject_id',
        'semester_order',
    ];

    public function plan() {
        return $this->belongsTo(Major::class);
    }
    public function majorSubject() {
        return $this->belongsTo(subject::class);
    }
}
