<?php

namespace App\Console\Commands;

use App\Models\ScheduleLesson;
use App\Models\StudentLesson;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateLessonStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lessons:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cập nhật trạng thái của các bản ghi student_lessons khi đến ngày học';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today('Asia/Ho_Chi_Minh');

        $lessonId = ScheduleLesson::whereDate('study_date', $today)
        ->pluck('lesson_id');

        $lessons = StudentLesson::whereIn('lesson_id', $lessonId)
        ->where('status', '0')->get();

        foreach ($lessons as $lesson) {
            if ($lesson->status === '0') { 
                $lesson->status = '1'; 
                $lesson->save();
            }
        }

        $this->info('Đã cập nhật trạng thái các buổi học cho ngày hôm nay.');
    }
}
