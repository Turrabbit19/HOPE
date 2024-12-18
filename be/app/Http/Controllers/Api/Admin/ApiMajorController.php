<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Major;
use App\Models\MajorSubject;
use App\Models\PlanSubject;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiMajorController extends Controller
{
    public function index()
    {
        try {
            $majors = Major::get();

            $data = $majors->map(function ($major) {
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

    public function getMainMajors()
    {
        try {
            $mainMajors = Major::where('main', 1)->get();

            $currentDate = Carbon::now();

            $data = $mainMajors->map(function ($mm) use ($currentDate) {
                $courses = Course::whereHas('students.majors', function ($query) use ($mm) {
                    $query->where('majors.major_id', $mm->id);
                })
                    ->where('start_date', '<=', $currentDate)
                    ->where('end_date', '>=', $currentDate)
                    ->withCount('students')
                    ->get();

                $courseData = $courses->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'name' => $course->name,
                    ];
                });

                return [
                    'id' => $mm->id,
                    'code' => $mm->code,
                    'name' => $mm->name,
                    'description' => $mm->description,
                    'status' => $mm->status ? "Đang hoạt động" : "Tạm dừng",
                    'courses' => $courseData->isEmpty() ? null : $courseData,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors hoặc Courses', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllSubMajors()
    {
        try {
            $mainMajors = Major::whereNotNull('major_id')->orWhere('id', 1)->get();

            $data = $mainMajors->map(function ($mm) {
                return [
                    'id' => $mm->id,
                    'code' => $mm->code,
                    'name' => $mm->name,
                    'description' => $mm->description,
                    'status' => $mm->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSubMajors(string $majorId)
    {
        try {
            $mainMajors = Major::where('major_id', $majorId)->get();

            $data = $mainMajors->map(function ($mm) {
                return [
                    'id' => $mm->id,
                    'code' => $mm->code,
                    'name' => $mm->name,
                    'description' => $mm->description,
                    'status' => $mm->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ngành học với ID: ' . $majorId], 404);
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
            'main' => 'nullable|integer',
            'major_id' => 'nullable|integer|exists:majors,id'
        ], [
            'code.required' => 'Mã ngành là bắt buộc.',
            'code.string' => 'Mã ngành phải là chuỗi ký tự.',
            'code.max' => 'Mã ngành không được vượt quá 19 ký tự.',
            'code.unique' => 'Mã ngành đã tồn tại.',
            
            'name.required' => 'Tên ngành là bắt buộc.',
            'name.string' => 'Tên ngành phải là chuỗi ký tự.',
            'name.max' => 'Tên ngành không được vượt quá 50 ký tự.',
            'name.unique' => 'Tên ngành đã tồn tại.',
            
            'description.required' => 'Mô tả là bắt buộc.',
            'description.string' => 'Mô tả phải là chuỗi ký tự.',
            
            'status.boolean' => 'Trạng thái phải là giá trị boolean (true/false hoặc 0/1).',
            
            'main.integer' => 'Chính ngành phải là số nguyên.',
            
            'major_id.integer' => 'Mã ngành phải là số nguyên.',
            'major_id.exists' => 'Mã ngành không tồn tại.',
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
        ], [
            'code.string' => 'Mã ngành phải là chuỗi ký tự.',
            'code.max' => 'Mã ngành không được vượt quá 19 ký tự.',
            'code.unique' => 'Mã ngành đã tồn tại.',
            
            'name.string' => 'Tên ngành phải là chuỗi ký tự.',
            'name.max' => 'Tên ngành không được vượt quá 50 ký tự.',
            'name.unique' => 'Tên ngành đã tồn tại.',
            
            'description.string' => 'Mô tả phải là chuỗi ký tự.',
            
            'status.boolean' => 'Trạng thái phải là giá trị boolean (true/false hoặc 0/1).',
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

    public function restore(string $id)
    {
        try {
            $major = Major::withTrashed()->findOrFail($id);

            if (!$major->trashed()) {
                return response()->json(['error' => 'Ngành học này chưa bị xóa.'], 400);
            }

            $major->restore();

            return response()->json(['data' => $major, 'message' => 'Khôi phục thành công.'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ngành học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Khôi phục thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllSubjects(string $majorId)
    {
        try {
            $major = MajorSubject::where('major_id', $majorId)->get();

            $subjectsByMajor = $major->map(function ($major) {
                return [
                    'id' => $major->subject->id,
                    'name' => $major->subject->name,
                    'description' => $major->subject->description,
                    'credit' => $major->subject->credit,
                    'order' => $major->subject->order,
                ];
            });
            return response()->json(['data' => $subjectsByMajor], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ngành học với ID: ' . $majorId, 404]);
        } catch (\Exception $e) {
            return response()->json(['error' => "Không thể truy cập vào bảng Majors", 'message' => $e->getMessage()], 500);
        }
    }

    public function getTeachersByMajor(string $majorId)
    {
        try {
            $teachers = Teacher::where('major_id', $majorId)->where('status', 1)->get();

            $data = $teachers->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                    'status' => $teacher->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn dữ liệu giáo viên', 'message' => $e->getMessage()], 500);
        }
    }
}
