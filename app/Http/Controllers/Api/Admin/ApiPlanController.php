<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ApiPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $plans = Plan::with('course', 'semesters', 'subjects')->paginate(9);

            $data = collect($plans->items())->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'course_name' => $plan->course->name,
                    'semesters' => $plan->semesters->map(function ($semester) {
                        return [
                            'semester_name' => $semester->name,
                            'semester_start' => Carbon::parse($semester->start_date)->format('d/m/Y'),
                            'semester_end' => Carbon::parse($semester->end_date)->format('d/m/Y'),
                        ];
                    }),
                    'subjects' => $plan->subjects->map(function ($subject) {
                        return [
                            'subject_code' => $subject->subject_code,
                            'subject_name' => $subject->name,
                            'subject_credit' => $subject->credit,
                        ];
                    }),
                ];
            });
            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $plans->total(),
                    'per_page' => $plans->perPage(),
                    'current_page' => $plans->currentPage(),
                    'last_page' => $plans->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Plans', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $plans = Plan::select('id', 'course_id', 'semester_id', 'subject_id')->get();
            return response()->json(['data' => $plans], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Plans', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'semester_id' => 'required|exists:semesters,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $plan = Plan::create($data);
            
            return response()->json(['data' => $plan, 'message' => 'Tạo mới thành công'], 201);
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
            $plan = Plan::findOrFail($id);
            return response()->json(['data' => $plan], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Plans', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'sometimes|exists:courses,id',
            'semester_id' => 'sometimes|exists:semesters,id',
            'subject_id' => 'sometimes|exists:subjects,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $plan = Plan::findOrFail($id);
            
            $data = $validator->validated();
            $data['updated_at'] = Carbon::now();
            $plan->update($data);

            return response()->json(['data' => $plan, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
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
            $plan = Plan::findOrFail($id);
            $plan->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}