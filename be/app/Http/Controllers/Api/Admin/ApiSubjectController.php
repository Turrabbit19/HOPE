<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Major;
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
            $subject = Subject::with('major', 'semester')->get();

            $result = $subject->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'major_id' => $subject->major_id,
                    'major_name' => $subject->major->name,
                    'semester_name' => $subject->semester->name,
                    'semester_id' => $subject->semester_id,
                    'subject_code' => $subject->subject_code,
                    'description' => $subject->description,
                    'credit' => $subject->credit
                ];
            });
            return response()->json(['data' => $result], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $subjectName = strtoupper($request->name);
        $existingSubject = Subject::where('name', $subjectName)->first();
        if ($existingSubject) {
            return response()->json(['message' => 'Tên kỳ học đã tồn tại'], 409);
        }
        $validator = Validator::make($request->all(), [
            // 'subject_code' => 'required|string|max:50|unique:subjects,subject_code',
            'semester_id' => 'required|exists:semesters,id',
            'major_id' => 'required|exists:majors,id',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'credit' => 'required|integer|min:1|max:19',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $major = Major::find($data['major_id']);
            $firstLetter = $this->generateCodeFromName($major->name, );
            $firstLetter = $this->generateCodeFromName($subjectName);
            $randomNumbers = str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
            $data['subject_code'] = $firstLetter . $randomNumbers;
            // Tạo mới Subject
            $subject = Subject::create($data);

            return response()->json(['data' => $subject, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    private function generateCodeFromName($name)
    {
        $words = explode(" ", $name);
        $initial = "";
        foreach ($words as $word) {
            $initial .= strtoupper(substr($word, 0, 1));
        }
        // $randomNumber = rand(100, 999)
        return $initial;
    }

    public function show(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            return response()->json(['data' => $subject], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'subject_code' => 'sometimes|string|max:50|unique:subjects,subject_code,' . $id,
            'semester_id' => 'sometimes|exists:semesters,id',
            'major_id' => 'sometimes|exists:majors,id',
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:255',
            'credit' => 'sometimes|integer|min:1|max:19',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $subject = Subject::findOrFail($id);
            $data = $validator->validated();
            $data['updated_at'] = Carbon::now();
            $subject->update($data);

            return response()->json(['data' => $subject, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
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
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    public function restore($id)
    {
        $subject = Subject::withTrashed()->find($id);
        if ($subject) {
            $subject->restore();
            $result =
                 [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'major_id' => $subject->major_id,
                    'major_name' => $subject->major->name,
                    'semester_name' => $subject->semester->name,
                    'semester_id' => $subject->semester_id,
                    'subject_code' => $subject->subject_code,
                    'description' => $subject->description,
                    'credit' => $subject->credit
                ];

            return response()->json(['message' => 'Môn học đã được khôi phục!', 'data' => $result], 200);
        }
        return response()->json(['message' => 'Bài viết không tồn tại!'], 404);
    }
}
