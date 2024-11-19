<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSemester;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiSemesterController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('perPage', 9);

            $semesters = Semester::paginate($perPage);
            $now = Carbon::now();

            $data = collect($semesters->items())->map(function ($semester) use ($now) {
                if ($now->lt(Carbon::parse($semester->start_date))) {
                    $status = "Chờ diễn ra"; 
                } elseif ($now->between(Carbon::parse($semester->start_date), Carbon::parse($semester->end_date))) {
                    $status = "Đang diễn ra"; 
                } elseif ($now->gt(Carbon::parse($semester->end_date))) {
                    $status = "Kết thúc"; 
                }

                return [
                    'id' => $semester->id,
                    'name' => $semester->name,
                    'start_date' => Carbon::parse($semester->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($semester->end_date)->format('d/m/Y'),
                    'courses' => $semester->orders->map(function ($order) {
                        return [
                            'id' => $order->course->id,
                            'order' => $order->order,
                        ];
                    }),
                    'status' => $status
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
            $now = Carbon::now();

            $data = $semesters->map(function ($semester) use ($now) {
                if ($now->lt(Carbon::parse($semester->start_date))) {
                    $status = "Chờ diễn ra"; 
                } elseif ($now->between(Carbon::parse($semester->start_date), Carbon::parse($semester->end_date))) {
                    $status = "Đang diễn ra"; 
                } elseif ($now->gt(Carbon::parse($semester->end_date))) {
                    $status = "Kết thúc"; 
                }

                return [
                    'id' => $semester->id,
                    'name' => $semester->name,
                    'start_date' => Carbon::parse($semester->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($semester->end_date)->format('d/m/Y'),
                    'status' => $status
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
            'status' => 'integer|in:0,1,2'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        try {
            $data = $validator->validated();
            $semester = Semester::create($data);
    
            $activeCourses = Course::where(function ($query) use ($data) {
                $query->where('start_date', '<=', $data['end_date'])
                      ->where('end_date', '>=', $data['start_date']);
            })->get();
    
            if ($activeCourses->isNotEmpty()) {
                $maxOrder = 9;
    
                $coursesWithOrder = $activeCourses->mapWithKeys(function ($course) use ($maxOrder) {
                    $currentMaxOrder = CourseSemester::where('course_id', $course->id)
                                    ->max('order');
                    $newOrder = min($currentMaxOrder + 1, $maxOrder);
                    return [$course->id => ['order' => $newOrder]];
                });
    
                $semester->courses()->syncWithoutDetaching($coursesWithOrder);
            }
    
            return response()->json(['data' => $semester, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $semester = Semester::findOrFail($id);
            $now = Carbon::now();

            if ($now->lt(Carbon::parse($semester->start_date))) {
                $status = "Chờ diễn ra"; 
            } elseif ($now->between(Carbon::parse($semester->start_date), Carbon::parse($semester->end_date))) {
                $status = "Đang diễn ra"; 
            } elseif ($now->gt(Carbon::parse($semester->end_date))) {
                $status = "Kết thúc"; 
            }

            $data = [
                    'id' => $semester->id,
                    'name' => $semester->name,
                    'start_date' => Carbon::parse($semester->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($semester->end_date)->format('d/m/Y'),
                    'courses' => $semester->orders->map(function ($order) {
                        return [
                            'id' => $order->course->id,
                            'order' => $order->order,
                        ];
                    }),
                    'status' => $status
                ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy kỳ học với ID: ' . $id], 404);
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
            'status' => 'sometimes|integer|in:0,1,2',
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
            return response()->json(['error' => 'Không tìm thấy kỳ học với ID: ' . $id], 404);
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
            return response()->json(['error' => 'Không tìm thấy kỳ học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function restore(string $id)
    {
        try {
            $semester = Semester::withTrashed()->findOrFail($id);
            $semester->restore();

            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy kỳ học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Khôi phục thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}