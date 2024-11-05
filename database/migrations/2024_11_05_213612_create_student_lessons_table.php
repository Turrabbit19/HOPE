<?php

use App\Models\Classroom;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Semester;
use App\Models\Shift;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Student::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Lesson::class)->constrained()->cascadeOnDelete();
            $table->enum('status', [0, 1, 2])->default(0); // 0 = unknown, 1 = Vắng, 2 = Có mặt
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_lessons');
    }
};
