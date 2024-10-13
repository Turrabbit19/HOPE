<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $schedules = Schedule::with(['courseSemester', 'majorSubject', 'classroom', 'teacher', 'shift', 'room'])->paginate(9);

            $data = collect($schedules->items())->map(function($schedule) {
                return [
                    'id' => $schedule->id,
                    'course_name' => $schedule->courseSemester->course->name,
                    'semester_name' => $schedule->courseSemester->semester->name,
                    'major_name' => $schedule->majorSubject->major->name,
                    'subject_name' => $schedule->majorSubject->subject->name,
                    'teacher_name' => $schedule->teacher->name,
                    'shift_name' => $schedule->shift->name,
                    'room_name' => $schedule->room->name,
                    'link' => $schedule->link ? $schedule->link : "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                    'status' => $schedule->status ? "Đang diễn ra" : "Kết thúc",
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $schedules->total(),
                    'per_page' => $schedules->perPage(),
                    'current_page' => $schedules->currentPage(),
                    'last_page' => $schedules->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $schedules = Schedule::with(['courseSemester', 'majorSubject', 'classroom', 'teacher', 'shift', 'room'])->get();

            $data = $schedules->map(function($schedule) {
                return [
                    'id' => $schedule->id,
                    'course_name' => $schedule->courseSemester->course->name,
                    'semester_name' => $schedule->courseSemester->semester->name,
                    'major_name' => $schedule->majorSubject->major->name,
                    'subject_name' => $schedule->majorSubject->subject->name,
                    'teacher_name' => $schedule->teacher->name,
                    'shift_name' => $schedule->shift->name,
                    'room_name' => $schedule->room->name,
                    'link' => $schedule->link ? $schedule->link : "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                    'status' => $schedule->status ? "Đang diễn ra" : "Kết thúc",
                ];
            });
            return response()->json(['data' => $data,], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_semester_id' => 'required|exists:course_semesters,id',
            'major_subject_id' => 'required|exists:major_subjects,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'teacher_id' => 'required|exists:teachers,id',
            'shift_id' => 'required|exists:shifts,id',
            'room_id' => 'required|exists:rooms,id',
            'link' => 'nullable|url',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $schedule = Schedule::create($data);

            return response()->json(['data' => $schedule, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $schedule = Schedule::with(['courseSemester', 'majorSubject', 'classroom', 'teacher', 'shift', 'room'])->findOrFail($id);
            $data = [
                    'id' => $schedule->id,
                    'course_name' => $schedule->courseSemester->course->name,
                    'semester_name' => $schedule->courseSemester->semester->name,
                    'major_name' => $schedule->majorSubject->major->name,
                    'subject_name' => $schedule->majorSubject->subject->name,
                    'teacher_name' => $schedule->teacher->name,
                    'shift_name' => $schedule->shift->name,
                    'room_name' => $schedule->room->name,
                    'link' => $schedule->link ? $schedule->link : "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                    'status' => $schedule->status ? "Đang diễn ra" : "Kết thúc",
                ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới lịch học', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'course_semester_id' => 'sometimes|required|exists:course_semesters,id',
            'major_subject_id' => 'sometimes|required|exists:major_subjects,id',
            'classroom_id' => 'sometimes|required|exists:classrooms,id',
            'teacher_id' => 'sometimes|required|exists:teachers,id',
            'shift_id' => 'sometimes|required|exists:shifts,id',
            'room_id' => 'sometimes|required|exists:rooms,id',
            'link' => 'nullable|url',
            'start_date' => 'sometimes|required|date|after_or_equal:today',
            'end_date' => 'sometimes|required|date|after:start_date',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $schedule = Schedule::findOrFail($id);

            $data = $validator->validated();
            $schedule->update($data);

            return response()->json(['data' => $schedule, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->delete();   
            return response()->json(['message' => 'Xóa thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    // public function getAllSchedules() {
    //     try {
    //         $schedules = Schedule::with(['courseSemester', 'planSubject', 'classroom', 'teacher', 'shift', 'room'])
    //             ->get();
                
    //         $data = $schedules->map(function ($schedule) {
    //             return [
    //                 'id' => $schedule->id,
    //                 'course_semester_id' => $schedule->course_semester_id,
    //                 'plan_subject_id' => $schedule->plan_subject_id,
    //                 'classroom_id' => $schedule->classroom_id,
    //                 'teacher_id' => $schedule->teacher_id,
    //                 'shift_id' => $schedule->shift_id,
    //                 'room_id' => $schedule->room_id,
    //                 'link' => $schedule->link,
    //                 'start_date' => $schedule->start_date,
    //                 'end_date' => $schedule->end_date,
    //                 'status' => $schedule->status,
    //                 'created_at' => $schedule->created_at,
    //                 'updated_at' => $schedule->updated_at,
    //             ];
    //         });
    
    //         return response()->json(['data' => $data], 200);
    
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Không thể truy vấn tới bảng Schedules', 'message' => $e->getMessage()], 500);
    //     }
    // }
    
}
