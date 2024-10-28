<?php

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
        Schema::table('plans', function (Blueprint $table) {
            $table->unsignedBigInteger('course_id')->nullable()->after('id'); // Thêm cột course_id
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }
    
    public function down()
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropColumn('course_id'); // Xóa cột course_id
        });
    }
};
