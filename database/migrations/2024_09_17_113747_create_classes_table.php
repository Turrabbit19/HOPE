<?php

use App\Models\Semester;
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
    public function up()
{
    Schema::create('classes', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->foreignIdFor(Subject::class)->constrainedTo()->onDelete('cascade');
        $table->foreignIdFor(Semester::class)->constrainedTo()->onDelete('cascade');
        $table->string('class_name', 50);
        $table->foreignIdFor(Teacher::class)->constrainedTo()->onDelete('cascade');
        $table->integer('max_students');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
