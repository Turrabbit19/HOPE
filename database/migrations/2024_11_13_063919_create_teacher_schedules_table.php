<?php

use App\Models\Schedule;
use App\Models\Teacher;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Teacher::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Schedule::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_schedules');
    }
};
