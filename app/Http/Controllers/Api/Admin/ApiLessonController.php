<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class ApiLessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $lessons = Lesson::with('subject')->paginate(9);

            $data = collect($lessons->items())->map(function ($lesson){
                return [
                    'id' => $lesson->id,
                    'subject_code' => $lesson->subject->code,
                    'subject_name' => $lesson->subject->name,
                    'name' => $lesson->name,
                    'description' =>$lesson->description,
                ];
            }); 
            return response()->json(['data' => $lessons], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Lessons', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
           $lessons = Lesson::select('id', 'subject_id', 'name', 'description')->get();
            return response()->json(['data' =>$lessons], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Lessons', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'name' => 'required|string|max:50',
            'description' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $lesson = Lesson::create($data);
            
            return response()->json(['data' => $lesson, 'message' => 'Tạo mới thành công'], 201);
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
            $lesson = Lesson::findOrFail($id);
            return response()->json(['data' => $lesson], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Lessons', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'sometimes|exists:subjects,id',
            'name' => 'sometimes|string|max:50',
            'description' => 'sometimes'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $lesson = Lesson::findOrFail($id);
            
            $data = $validator->validated();
            $data['updated_at'] = Carbon::now();
            $lesson->update($data);
            
            return response()->json(['data' =>$lesson, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $lesson = Lesson::findOrFail($id);
            $lesson->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}