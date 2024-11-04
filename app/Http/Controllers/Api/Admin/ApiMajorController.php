<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\MajorSubject;
use App\Models\PlanSubject;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiMajorController extends Controller
{
    public function index()
    {
        try {
            $majors = Major::get();

            $data = $majors->map(function($major) {
                return [
                    'id' => $major->id,
                    'code' => $major->code,
                    'name' => $major->name,
                    'description' => $major->description,
                    'status' => $major->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:19|unique:majors,code',
            'name' => 'required|string|max:50|unique:majors,name',
            'description' => 'required|string',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $major = Major::create($data);

            return response()->json(['data' => $major, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $major = Major::findOrFail($id);
            $data = [
                    'id' => $major->id,
                    'code' => $major->code,
                    'name' => $major->name,
                    'description' => $major->description,
                    'status' => $major->status ? "Đang hoạt động" : "Tạm dừng",
                ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ngành học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|string|max:19|unique:majors,code,' . $id,
            'name' => 'sometimes|string|max:50|unique:majors,name,' . $id,
            'description' => 'nullable|string',
            'status' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $major = Major::findOrFail($id);
            
            $data = $validator->validated();
            $major->update($data);

            return response()->json(['data' => $major, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ngành học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $major = Major::findOrFail($id);
            $major->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ngành học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllSubjects(string $majorId) {
        try {    
            $majorSubjects = MajorSubject::where('major_id', $majorId)->with('subject')->get();
    
            $data = $majorSubjects->map(function ($majorSubject) {
                return [
                    'id' => $majorSubject->subject->id,
                    'code' => $majorSubject->subject->code,
                    'name' => $majorSubject->subject->name,
                    'description' => $majorSubject->subject->description,
                    'credit' => $majorSubject->subject->credit,
                    'status' => $majorSubject->subject->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });
    
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy chuyên ngành với ID: ' . $majorId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng MajorSubject', 'message' => $e->getMessage()], 500);
        }
    }

    public function filterMajorsByOrder(string $planId, string $majorId) {
        try {
            $planSubjects = PlanSubject::where('plan_id', $planId)
                ->join('major_subjects', 'plan_subjects.major_subject_id', '=', 'major_subjects.id')
                ->join('subjects', 'major_subjects.subject_id', '=', 'subjects.id')
                ->where('major_subjects.major_id', $majorId)
                ->select('plan_subjects.semester_order', 'subjects.code', 'subjects.name', 'subjects.credit')
                ->get();
    
            $groupSubjects = $planSubjects->groupBy('semester_order');
    
            $data = $groupSubjects->map(function ($subjects, $semesterOrder) {
                return [
                    'id' => $semesterOrder,
                    'subjects' => $subjects->map(function ($subject) {
                        return [
                            'code' => $subject->code,
                            'name' => $subject->name,
                            'credit' => $subject->credit,
                        ];
                    }),
                ];
            })->values(); 
    
            return response()->json(['semester_order' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy kế hoạch học tập với ID: ' . $planId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng PlanSubject', 'message' => $e->getMessage()], 500);
        }
    } 
}