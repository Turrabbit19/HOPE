<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiSemesterController extends Controller
{

    public function restore($id)
{
    try {
        $semester = Semester::withTrashed()->find($id);

        if ($semester) {
            $semester->restore();

            $semester->save();

            $statusMessage = $semester->status ? "Đang diễn ra" : "Kết thúc";

            return response()->json([
                'data' => [
                    'semester' => $semester,
                    'status' => $statusMessage
                ],
                'message' => 'Khôi phục thành công.'
            ], 200);
        }

        return response()->json(['error' => 'Không tìm thấy bản ghi.'], 404);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Đã xảy ra lỗi trong quá trình khôi phục.'], 500);
    }
}

public function index(Request $request)
{
    try {
        $perPage = $request->input('perPage', 9);

        $semesters = Semester::paginate($perPage);

        $data = collect($semesters->items())->map(function ($semester) {
            return [
                'id' => $semester->id,
                'name' => $semester->name,
                'start_date' => Carbon::parse($semester->start_date),
                'end_date' => Carbon::parse($semester->end_date),
                'courses' => $semester->orders->map(function ($order) {
                    return [
                        'id' => $order->course->id,
                        'order' => $order->order,
                    ];
                }),
                'status' => $semester->name,
            ];
        });

        return response()->json([
            'data' => $data,
            'pagination' => [
                'total' => $semesters->total(),
                'per_page' => $semesters->perPage(),
                'current_page' => $semesters->currentPage(),
                'last_page' => $semesters->lastPage(),
            ]
        ], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Không thể truy vấn tới bảng Semesters', 'message' => $e->getMessage()], 500);
    }
}

    public function getAll()
    {
        try {
            $semesters = Semester::get();

            $data = $semesters->map(function ($semester) {
                return [
                    'id' => $semester->id,
                    'name' => $semester->name,
                    'start_date' => Carbon::parse($semester->start_date),
                    'end_date' => Carbon::parse($semester->end_date),
                    'status' => $semester->status ? "Đang diễn ra" : "Kết thúc",
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Semesters', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:semesters',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|boolean',
            'courses' => 'required|array',
            'courses.*.id' => 'required|exists:courses,id',
            'courses.*.order' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $semester = Semester::create($data);

            $coursesWithOrder = collect($data['courses'])->mapWithKeys(function ($course) {
                return [$course['id'] => ['order' => $course['order']]];
            });

            $semester->courses()->sync($coursesWithOrder);

            return response()->json(['data' => $semester, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $semester = Semester::findOrFail($id);
            return response()->json(['data' => $semester], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Semesters', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:semesters,name,' . $id,
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|boolean',
            'courses' => 'sometimes|array',
            'courses.*.id' => 'sometimes|exists:courses,id',
            'courses.*.order' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $semester = Semester::findOrFail($id);

            $data = $validator->validated();
            $semester->update($data);

            if (isset($data['courses'])) {
                $coursesWithOrder = collect($data['courses'])->mapWithKeys(function ($course) {
                    return [$course['id'] => ['order' => $course['order']]];
                });

                $semester->courses()->sync($coursesWithOrder);
            }

            return response()->json(['data' => $semester, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $semester = Semester::findOrFail($id);
            $semester->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
