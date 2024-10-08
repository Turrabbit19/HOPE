<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiClassRoom extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $classrooms = Classroom::with('subject')->paginate(9);

            $data = collect($classrooms->items())->map(function ($classroom) {
                return [
                    'id' => $classroom->id,
                    'subject_code' => $classroom->subject->code,
                    'subject_name' => $classroom->subject->name,
                    'code' =>  $classroom->code,
                    'max_students' =>  $classroom->max_students,
                    'status' =>  $classroom->status ? "Đang diễn ra" : "Kết thúc",
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
                    'subject_code' => $classroom->subject->code,
                    'subject_name' => $classroom->subject->name,
                    'code' =>  $classroom->code,
                    'max_students' =>  $classroom->max_students,
                    'status' =>  $classroom->status ? "Đang diễn ra" : "Kết thúc",
                ];
            });

            return response()->json(['data' =>$data], 200);
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
            'subject_id' => 'required',
            'code' => 'required|string|unique:classrooms',
            'max_students' => 'required|max:40',
            'status' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $classroom = Classroom::create($data);
            
            return response()->json(['data' => $classroom, 'message' => 'Tạo mới thành công'], 201);
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
            $classroom = Classroom::findOrFail($id);
            return response()->json(['data' => $classroom], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
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
            'code' => 'required|string|unique:classrooms',
            'max_students' => 'required|max:40',
            'status' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $classroom = Classroom::findOrFail($id);
            
            $data = $validator->validated();
            $data['updated_at'] = Carbon::now();
            $classroom->update($data);
            
            return response()->json(['data' =>$classroom, 'message' => 'Tạo mới thành công'], 201);
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
            $classroom = Classroom::findOrFail($id);
            $classroom->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
