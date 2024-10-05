<?php

use App\Models\Course;
use App\Models\Major;
use App\Models\Semester;
use App\Models\User;
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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Course::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Major::class)->constrained()->onDelete('cascade');
            $table->tinyInteger('current_semester');
            $table->string('student_code')->unique();
            $table->tinyInteger('status');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};