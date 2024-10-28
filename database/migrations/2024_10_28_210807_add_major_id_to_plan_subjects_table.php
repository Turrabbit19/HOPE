<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('plan_subjects', function (Blueprint $table) {
        $table->unsignedBigInteger('major_id')->nullable()->after('id'); // Thêm cột major_id
        $table->foreign('major_id')->references('id')->on('majors')->onDelete('cascade'); // Ràng buộc khóa ngoại nếu cần
    });
}

public function down()
{
    Schema::table('plan_subjects', function (Blueprint $table) {
        $table->dropForeign(['major_id']); // Xóa ràng buộc khóa ngoại nếu có
        $table->dropColumn('major_id'); // Xóa cột major_id
    });
}

};
