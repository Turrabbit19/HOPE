<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function restore($id)
     {
         $classroom = Classroom::withTrashed()->find($id);

         if ($classroom) {
             $classroom->restore();

             return response()->json(['data' => $classroom, 'message' => 'Khôi phục thành công.'], 200);
         }

         return response()->json(['error' => 'Không tìm thấy bản ghi.'], 404);
     }
    public function index()
    {
        try {
            $classrooms = Classroom::with('subject')->paginate(8);

            $data = collect($classrooms->items())->map(function($classroom) {
                return [
                    'id' => $classroom->id,
                    'subject_name' => $classroom->subject->name,
                    'subject_id' => $classroom->subject_id,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $classroom->status,
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $classrooms->total(),
                    'per_page' => $classrooms->perPage(),
                    'current_page' => $classrooms->currentPage(),
                    'last_page' => $classrooms->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $classrooms = Classroom::with('subject')->get();

            $data = $classrooms->map(function ($classroom){
                return [
                    'id' => $classroom->id,
                    'subject_name' => $classroom->subject->name,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $classroom->status,
                ];
            });

            return response()->json(['data' =>$data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }


    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'subject_id' => 'required|exists:subjects,id',
        'code' => 'required|string|max:10|unique:classrooms',
        'max_students' => 'required|integer|min:1',
        'status' => 'boolean',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    try {
        $data = $validator->validated();
        $classroom = Classroom::create($data);

        $subject = Subject::find($data['subject_id']);

        return response()->json([
            'data' => [
                'subject_name' => $subject->name,
                'subject_id' => $subject->id,
                'code' => $classroom->code,
                'max_students' => $classroom->max_students,
                'status' => $classroom->status,
            ],
            'message' => 'Tạo mới thành công'
        ], 201);
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
            $classroom = Classroom::with('subject')->findOrFail($id);
            return response()->json(['data' => $classroom], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lớp học'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'sometimes|required|exists:subjects,id',
            'code' => 'sometimes|required|string|max:10|unique:classrooms,code,' . $id,
            'max_students' => 'sometimes|required|integer|min:1',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $classroom = Classroom::findOrFail($id);

            $data = $validator->validated();
            $classroom->update($data);

            return response()->json(['data' => $classroom, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lớp học'], 404);
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
            $classroom = Classroom::findOrFail($id);
            $classroom->delete();

            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lớp học'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
