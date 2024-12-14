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
                    'form' => $subject->form,
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
                    'form' => $subject->form,
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
            $responseData = [
                'id' => $subject->id,
                'code' => $subject->code,
                'name' => $subject->name,
                'description' => $subject->description,
                'credit' => $subject->credit,
                'order' => $subject->order,
                'form' => $subject->form,
                'status' => $subject->status,
            ];

            return response()->json(['data' => $responseData, 'message' => 'Cập nhật thành công'], 200);


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

    public function getMajorBySubject(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);

            $major = $subject->major;

            return response()->json([
                'data' => [
                    'major_id' => $major->id
                ],
                'message' => 'Major retrieved successfully.'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Không tìm thấy môn học với ID: ' . $id
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Lessons',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function addLessons(Request $request, string $id) {

        $validator = Validator::make($request->all(), [
            '*.name' => 'required|string|max:50',
            '*.description' => 'required|string',
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
                // $lessons[] = $lesson;
                $lessons[] = $lesson->only(['id', 'name', 'description']);
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
                    'max_students' => $classroom->max_students,
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
