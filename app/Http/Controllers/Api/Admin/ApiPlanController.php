<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\MajorSubject;
use App\Models\Plan;
use App\Models\PlanSubject;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ApiPlanController extends Controller
{
    public function index()
    {
        try {
            $plans = Plan::get();

            $majors = Major::get();

            $data = $plans->map(function($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'status' => $plan->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Plans', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50|unique:plans,name',
            'status' => 'boolean',
            
            'majors' => 'required|array',
            'majors.*.id' => 'required|exists:majors,id',
            'majors.*.semesters' => 'required|array',
            'majors.*.semesters.*.order' => 'required|integer',
            'majors.*.semesters.*.subjects' => 'required|array',
            'majors.*.semesters.*.subjects.*.id' => 'required|exists:subjects,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $plan = Plan::create($data);

            $majorSubjectIds = MajorSubject::whereIn('major_id', collect($data['majors'])->pluck('id'))
                ->whereIn('subject_id', collect($data['majors'])->pluck('semesters.*.subjects.*.id')->flatten())
                ->get()
                ->keyBy(function ($item) {
                    return $item->major_id . '+' . $item->subject_id;
                });

            foreach ($data['majors'] as $major) {
                foreach ($major['semesters'] as $semester) {
                    foreach ($semester['subjects'] as $subject) {
                        $key = $major['id'] . '+' . $subject['id'];
                        if (isset($majorSubjectIds[$key])) {
                            PlanSubject::create([
                                'plan_id' => $plan->id,
                                'major_subject_id' => $majorSubjectIds[$key]->id,
                                'semester_order' => $semester['order'],
                            ]);
                        } else {
                            return response()->json(['error' => 'Không tìm thấy major_subject với major_id: ' . $major['id'] . ' và subject_id: ' . $subject['id']], 400);
                        }
                    }
                }
            }
            
            return response()->json(['data' => $plan, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $plan = Plan::with(['planSubjects.majorSubject.major', 'planSubjects.majorSubject.subject'])->findOrFail($id);
            
            $data = [
                'id' => $plan->id,
                'name' => $plan->name,
                'status' => $plan->status ? "Đang hoạt động" : "Tạm dừng",
                'majors' => $plan->planSubjects->groupBy('majorSubject.major_id')->map(function ($group) {
                    return [
                        'id' => $group->first()->majorSubject->major->id,
                        'name' => $group->first()->majorSubject->major->name,
                        'semesters' => $group->groupBy('semester_order')->map(function ($semesterGroup) {
                            return [
                                'order' => $semesterGroup->first()->semester_order,
                                'subjects' => $semesterGroup->map(function ($planSubject) {
                                    return [
                                        'id' => $planSubject->majorSubject->subject->id,
                                        'name' => $planSubject->majorSubject->subject->name,
                                    ];
                                }),
                            ];
                        })->values()->toArray(),
                    ];
                })->values()->toArray(),
            ];
    
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy kế hoạch với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Plans', 'message' => $e->getMessage()], 500);
        }
    }     

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:50|unique:plans,name,' . $id,
            'status' => 'sometimes|boolean',

            'majors' => 'sometimes|array',
            'majors.*.id' => 'required_with:majors|exists:majors,id',
            'majors.*.semesters' => 'required_with:majors|array',
            'majors.*.semesters.*.order' => 'required_with:majors|integer',
            'majors.*.semesters.*.subjects' => 'required_with:majors|array',
            'majors.*.semesters.*.subjects.*.id' => 'required_with:majors|exists:subjects,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $plan = Plan::findOrFail($id);
            
            $data = $validator->validated();
            $plan->update($data);

            if (isset($data['majors'])) {
                $plan->planSubjects()->delete();

                $majorSubjectIds = MajorSubject::whereIn('major_id', collect($data['majors'])->pluck('id'))
                    ->whereIn('subject_id', collect($data['majors'])->pluck('semesters.*.subjects.*.id')->flatten())
                    ->get()
                    ->keyBy(function ($item) {
                        return $item->major_id . '+' . $item->subject_id;
                    });

                foreach ($data['majors'] as $major) {
                    foreach ($major['semesters'] as $semester) {
                        foreach ($semester['subjects'] as $subject) {
                            $key = $major['id'] . '+' . $subject['id'];
                            if (isset($majorSubjectIds[$key])) {
                                PlanSubject::create([
                                    'plan_id' => $plan->id,
                                    'major_subject_id' => $majorSubjectIds[$key]->id,
                                    'semester_order' => $semester['order'],
                                ]);
                            } else {
                                return response()->json(['error' => 'Không tìm thấy major_subject với major_id: ' . $major['id'] . ' và subject_id: ' . $subject['id']], 400);
                            }
                        }
                    }
                }
            }

            return response()->json(['data' => $plan, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy kế hoạch với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $plan = Plan::findOrFail($id);
            $plan->delete();

            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy kế hoạch với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}