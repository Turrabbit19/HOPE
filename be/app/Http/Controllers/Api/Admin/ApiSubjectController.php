<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Lesson;
use App\Models\Major;
use App\Models\MajorSubject;
use App\Models\Subject;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redis;

class ApiSubjectController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);

            $subjects = Subject::paginate($perPage);

            $data = collect($subjects->items())->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'description' => $subject->description,
                    'credit' => $subject->credit,
                    'order' => $subject->order,
                    'max_students' => $subject->max_students,
                    'form' => $subject->form ? "Trực tuyến" : "Trực tiếp",
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
                    'order' => $subject->order,
                    'max_students' => $subject->max_students,
                    'form' => $subject->form ? "Trực tuyến" : "Trực tiếp",
                ];
            });

            return response()->json([
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function filterSubjectsByMajor(string $majorId, Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);

            $subjectsQuery = Subject::whereHas('majors', function ($query) use ($majorId) {
                $query->where('majors.id', $majorId);
            });

            $subjects = $subjectsQuery->paginate($perPage);

            $data = $subjects->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'description' => $subject->description,
                    'credit' => $subject->credit,
                    'order' => $subject->order,
                    'form' => $subject->form ? 'Trực tuyến' : 'Trực tiếp',
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
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Ngành học không tồn tại với ID: ' . $majorId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn dữ liệu', 'message' => $e->getMessage()], 500);
        }
    }

    public function getMajorsBySubject(string $subjectId)
    {
        try {
            $subject = Subject::with('majors')->findOrFail($subjectId);

            $majors = $subject->majors->map(function ($major) {
                $status = '';
                $mainMajorName = null;

                if ($major->id == 1) {
                    $status = 'Cơ bản';
                } elseif ($major->main == 1) {
                    $status = 'Ngành chính';
                } else {
                    $status = 'Chuyên ngành hẹp';

                    if ($major->major_id) {
                        $mainMajor = Major::find($major->major_id);

                        if ($mainMajor) {
                            $mainMajorName = $mainMajor->name;
                        }
                    }
                }

                return [
                    'id' => $major->id,
                    'name' => $major->name,
                    'status' => $status,
                    'main_major' => $mainMajorName,
                ];
            });

            return response()->json(['data' => $majors], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $subjectId], 404);
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
            'order' => 'required|integer|min:1|max:9',
            'max_students' => 'required|integer|min:30',
            'form' => 'required|boolean|in:0,1',
            'majors' => 'nullable|array',
            'majors.*' => 'required_with:majors|exists:majors,id',
            'sub_major' => 'nullable|integer|exists:majors,id',
        ], [
            'code.required' => 'Mã môn học là bắt buộc.',
            'code.string' => 'Mã môn học phải là chuỗi.',
            'code.max' => 'Mã môn học không được vượt quá 50 ký tự.',
            'code.unique' => 'Mã môn học này đã tồn tại.',
            
            'name.required' => 'Tên môn học là bắt buộc.',
            'name.string' => 'Tên môn học phải là chuỗi.',
            'name.max' => 'Tên môn học không được vượt quá 100 ký tự.',
            'name.unique' => 'Tên môn học này đã tồn tại trong hệ thống.',
            
            'description.string' => 'Mô tả môn học phải là chuỗi ký tự.',
            'description.max' => 'Mô tả môn học không được vượt quá 255 ký tự.',
            
            'credit.required' => 'Số tín chỉ là bắt buộc.',
            'credit.integer' => 'Số tín chỉ phải là một số nguyên.',
            'credit.min' => 'Số tín chỉ phải lớn hơn hoặc bằng 1.',
            'credit.max' => 'Số tín chỉ không được vượt quá 19.',
            
            'order.required' => 'Thứ tự môn học là bắt buộc.',
            'order.integer' => 'Thứ tự môn học phải là một số nguyên.',
            'order.min' => 'Thứ tự môn học phải lớn hơn hoặc bằng 1.',
            'order.max' => 'Thứ tự môn học không được vượt quá 9.',
            
            'max_students.required' => 'Số lượng sinh viên tối đa là bắt buộc.',
            'max_students.integer' => 'Số lượng sinh viên tối đa phải là một số nguyên.',
            'max_students.min' => 'Số lượng sinh viên tối đa phải ít nhất là 30.',
            
            'form.required' => 'Hình thức học là bắt buộc.',
            'form.boolean' => 'Hình thức học phải là true hoặc false.',
            'form.in' => 'Hình thức học phải có giá trị là 0 hoặc 1.',
            
            'majors.array' => 'Các chuyên ngành phải là một mảng.',
            'majors.*.required_with' => 'Mỗi chuyên ngành phải được chọn khi có giá trị cho các chuyên ngành.',
            'majors.*.exists' => 'Chuyên ngành không tồn tại.',
            
            'sub_major.integer' => 'Chuyên ngành phụ phải là một số nguyên.',
            'sub_major.exists' => 'Chuyên ngành phụ không tồn tại trong hệ thống.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $subject = Subject::create($data);

            if (isset($data['majors']) && $data['majors'] === [1]) {
                $subject->majors()->sync([1]);
            } elseif (isset($data['majors']) && count($data['majors']) > 0) {
                $subject->majors()->sync($data['majors']);
            } else {
                $subject->majors()->sync([]);
            }

            if (isset($data['sub_major'])) {
                $subject->majors()->sync([$data['sub_major']]);
            }
            Redis::del('syllabus');

            return response()->json(['data' => $subject, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $subject = Subject::with('majors')->findOrFail($id);
            $majors = $subject->majors->map(function ($major) {
                $status = '';
                $mainMajorName = null;

                if ($major->id == 1) {
                    $status = 'Cơ bản';
                } elseif ($major->main == 1) {
                    $status = 'Ngành chính';
                } else {
                    $status = 'Chuyên ngành hẹp';
                    if ($major->major_id) {
                        $mainMajor = Major::find($major->major_id);
                        if ($mainMajor) {
                            $mainMajorName = $mainMajor->name;
                        }
                    }
                }

                return [
                    'id' => $major->id,
                    'name' => $major->name,
                    'status' => $status,
                    'main_major' => $mainMajorName,
                ];
            });

            $data = [
                'id' => $subject->id,
                'code' => $subject->code,
                'name' => $subject->name,
                'description' => $subject->description,
                'credit' => $subject->credit,
                'max_students' => $subject->max_students,
                'order' => $subject->order,
                'form' => $subject->form,
                'majors' => $majors,
            ];

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
            'name' => 'sometimes|string|max:100|unique:subjects,name,' . $id,
            'description' => 'nullable|string|max:255',
            'credit' => 'sometimes|integer|min:1|max:19',
            'order' => 'sometimes|integer|min:1|max:9',
            'max_students' => 'sometimes|integer|min:30',
            'form' => 'sometimes|boolean|in:0,1',
            'majors' => 'nullable|array',
            'majors.*' => 'required_with:majors|exists:majors,id',
            'sub_major' => 'nullable|integer|exists:majors,id',
        ], [
            'code.sometimes' => 'Mã môn học là tùy chọn nhưng nếu có, phải là chuỗi và không vượt quá 50 ký tự.',
            'code.string' => 'Mã môn học phải là chuỗi.',
            'code.max' => 'Mã môn học không được vượt quá 50 ký tự.',
            'code.unique' => 'Mã môn học này đã tồn tại.',
            
            'name.sometimes' => 'Tên môn học là tùy chọn nhưng nếu có, phải là chuỗi và không vượt quá 100 ký tự.',
            'name.string' => 'Tên môn học phải là chuỗi.',
            'name.max' => 'Tên môn học không được vượt quá 100 ký tự.',
            'name.unique' => 'Tên môn học này đã tồn tại.',
            
            'description.string' => 'Mô tả môn học phải là chuỗi.',
            'description.max' => 'Mô tả môn học không được vượt quá 255 ký tự.',
            
            'credit.sometimes' => 'Số tín chỉ là tùy chọn nhưng nếu có, phải là số nguyên và trong phạm vi từ 1 đến 19.',
            'credit.integer' => 'Số tín chỉ phải là một số nguyên.',
            'credit.min' => 'Số tín chỉ phải lớn hơn hoặc bằng 1.',
            'credit.max' => 'Số tín chỉ không được vượt quá 19.',
            
            'order.sometimes' => 'Thứ tự môn học là tùy chọn nhưng nếu có, phải là số nguyên và trong phạm vi từ 1 đến 9.',
            'order.integer' => 'Thứ tự môn học phải là một số nguyên.',
            'order.min' => 'Thứ tự môn học phải lớn hơn hoặc bằng 1.',
            'order.max' => 'Thứ tự môn học không được vượt quá 9.',
            
            'max_students.sometimes' => 'Số lượng sinh viên tối đa là tùy chọn nhưng nếu có, phải là số nguyên và ít nhất 30.',
            'max_students.integer' => 'Số lượng sinh viên tối đa phải là một số nguyên.',
            'max_students.min' => 'Số lượng sinh viên tối đa phải ít nhất là 30.',
            
            'form.sometimes' => 'Hình thức học là tùy chọn nhưng nếu có, phải là boolean và có giá trị là 0 hoặc 1.',
            'form.boolean' => 'Hình thức học phải là true hoặc false.',
            'form.in' => 'Hình thức học phải có giá trị là 0 hoặc 1.',
            
            'majors.array' => 'Các chuyên ngành phải là một mảng.',
            'majors.*.required_with' => 'Mỗi chuyên ngành phải được chọn khi có giá trị cho các chuyên ngành.',
            'majors.*.exists' => 'Chuyên ngành không tồn tại.',
            
            'sub_major.integer' => 'Chuyên ngành phụ phải là một số nguyên.',
            'sub_major.exists' => 'Chuyên ngành phụ không tồn tại trong hệ thống.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $subject = Subject::findOrFail($id);
            $data = $validator->validated();

            $subject->update($data);

            if (isset($data['majors']) && $data['majors'] === [1]) {
                $subject->majors()->sync([1]);
            } elseif (isset($data['majors']) && count($data['majors']) > 0) {
                $subject->majors()->sync($data['majors']);
            } else {
                $subject->majors()->sync([]);
            }

            if (isset($data['sub_major'])) {
                $subject->majors()->sync([$data['sub_major']]);
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

    public function restore(string $id)
    {
        try {
            $subject = Subject::withTrashed()->findOrFail($id);
            $subject->restore();
            return response()->json(['message' => 'Khôi phục thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Khôi phục thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllLessons(string $id)
    {
        try {
            $lessons = Lesson::where('subject_id', $id)->get();

            $data = $lessons->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'name' => $lesson->name,
                    'description' => $lesson->description,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Lessons', 'message' => $e->getMessage()], 500);
        }
    }
    public function addLessons(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            '*.name' => 'required|string|max:50',
            '*.description' => 'required|string',
        ], [
            '*.name.required' => 'Tên là bắt buộc.',
            '*.name.string' => 'Tên phải là chuỗi ký tự.',
            '*.name.max' => 'Tên không được vượt quá 50 ký tự.',
            
            '*.description.required' => 'Mô tả là bắt buộc.',
            '*.description.string' => 'Mô tả phải là chuỗi ký tự.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $validatedData = $validator->validated();
            $lessons = [];

            foreach ($validatedData as $lessonData) {
                $lessonData['subject_id'] = $id;
                $lesson = Lesson::create($lessonData);
                $lessons[] = $lesson;
            }

            return response()->json(['data' => $lessons, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllClassrooms(string $id)
    {
        try {
            $classrooms = Classroom::where('subject_id', $id)->get();

            $data = $classrooms->map(function ($classroom) {
                return [
                    'id' => $classroom->id,
                    'code' => $classroom->code,
                    'max_students' => $classroom->subject->max_students,
                    'status' => $classroom->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }
    public function addClassrooms(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            '*.code' => 'required|string|max:10|unique:classrooms,code',
            '*.max_students' => 'required|integer|min:1',
            '*.status' => 'boolean',
        ], [
            '*.code.required' => 'Mã lớp học là bắt buộc.',
            '*.code.string' => 'Mã lớp học phải là chuỗi ký tự.',
            '*.code.max' => 'Mã lớp học không được vượt quá 10 ký tự.',
            '*.code.unique' => 'Mã lớp học này đã tồn tại trong hệ thống.',
            
            '*.max_students.required' => 'Số lượng học sinh là bắt buộc.',
            '*.max_students.integer' => 'Số lượng học sinh phải là một số nguyên.',
            '*.max_students.min' => 'Số lượng học sinh phải lớn hơn hoặc bằng 1.',
            
            '*.status.boolean' => 'Trạng thái phải là giá trị true hoặc false.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $validatedData = $validator->validated();
            $classrooms = [];

            foreach ($validatedData as $classroomData) {
                $classroomData['subject_id'] = $id;
                $classroom = Classroom::create($classroomData);
                $classrooms[] = $classroom;
            }

            return response()->json(['data' => $classrooms, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
