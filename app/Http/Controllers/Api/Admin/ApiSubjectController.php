<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiSubjectController extends Controller
{
    public function index()
    {
        try {
            $subjects = Subject::paginate(9);

            $data = collect($subjects->items())->map(function ($subject){
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'description' => $subject->description,
                    'credit' => $subject->credit,
                ];
            }); 

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $subjects->total(),
                    'per_page' => $subjects->perPage(),
                    'current_page' => $subjects->currentPage(),
                    'last_page' => $subjects->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $subjects = Subject::get();

            $data = $subjects->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'description' => $subject->description,
                    'credit' => $subject->credit,
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:subjects', 
            'name' => 'required|string|max:100|unique:subjects', 
            'description' => 'nullable|string|max:255', 
            'credit' => 'required|integer|min:1|max:19',
            'majors' => 'required|array',
            'majors.*.id' => 'required|exists:majors,id',
            'majors.*.course_id' => 'required|exists:courses,id',
            'majors.*.semester_order' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $subject = Subject::create($data);

            $majorsWithOrder = collect($data['majors'])->mapWithKeys(function ($major) {
                return [$major['id'] => [
                    'course_id' => $major['course_id'],
                    'semester_order' => $major['semester_order']
                    ]
                ];
            });
            
            $subject->majors()->sync($majorsWithOrder);
            
            return response()->json(['data' => $subject, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            $data = $subject->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'description' => $subject->description,
                    'credit' => $subject->credit,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|string|max:50|unique:subjects,code,' . $id, 
            'name' => 'sometimes|string|max:100|unique:subjects,name' . $id, 
            'description' => 'nullable|string|max:255', 
            'credit' => 'sometimes|integer|min:1|max:19',
            'majors' => 'sometimes|array',
            'majors.*.id' => 'sometimes|exists:majors,id',
            'majors.*.course_id' => 'sometimes|exists:courses,id',
            'majors.*.semester_order' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $subject = Subject::findOrFail($id);
            
            $data = $validator->validated();
            $subject->update($data);

            if(isset($data['majors'])) {
                $majorsWithOrder = collect($data['majors'])->mapWithKeys(function ($major) {
                    return [$major['id'] => [
                        'course_id' => $major['course_id'],
                        'semester_order' => $major['semester_order']
                        ]
                    ];
                });
                
                $subject->majors()->sync($majorsWithOrder);
            }

            return response()->json(['data' => $subject, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            $subject->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}