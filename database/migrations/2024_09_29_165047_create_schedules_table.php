<?php

use App\Models\Classroom;
use App\Models\CourseSemester;
use App\Models\MajorSubject;
use App\Models\Room;
use App\Models\Shift;
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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(CourseSemester::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(MajorSubject::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Classroom::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Teacher::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Shift::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Room::class)->nullable()->constrained()->cascadeOnDelete();
            $table->text('link')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('status')->default(TRUE); // 'Đang diễn ra', 'Kết thúc'
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
