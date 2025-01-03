<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;
use App\Models\Room;
use Carbon\Carbon;

class ApiShiftController extends Controller
{
    public function index()
    {
        try {
            $shifts = Shift::get();

            $data = $shifts->map(function ($shift) {
                return [
                    'id' => $shift->id,
                    'name' => $shift->name,
                    'start_time' => Carbon::parse($shift->start_time)->format('H:i'),
                    'end_time' => Carbon::parse($shift->end_time)->format('H:i'),
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Shifts', 'message' => $e->getMessage()], 500);
        }
    }

    public function getFilteredShifts(Request $request)
    {
        try {
            $start_date = Carbon::parse($request->input('start_date'))->startOfDay();
            $end_date = Carbon::parse($request->input('end_date'))->endOfDay();

            $days = $request->input('days_of_week', []);

            // Lọc các ca học có lịch học đã tồn tại trong phạm vi thời gian và ngày đã chọn
            $availableShifts = Shift::whereHas('schedules', function ($query) use ($start_date, $end_date, $days) {
                $query->where(function ($subQuery) use ($start_date, $end_date) {
                    $subQuery->whereBetween('start_date', [$start_date, $end_date])
                        ->orWhereBetween('end_date', [$start_date, $end_date])
                        ->orWhere(function ($nestedQuery) use ($start_date, $end_date) {
                            $nestedQuery->where('start_date', '<=', $start_date)
                                ->where('end_date', '>=', $end_date);
                        });
                });
            })
                ->orWhereDoesntHave('schedules')  // Các ca học không có lịch học (không phải lịch bị trùng)
                ->get(['id', 'name', 'start_time', 'end_time']);

            // Nếu `availableShifts` không phải là mảng, bạn phải xử lý:
            if (!is_array($availableShifts) && $availableShifts instanceof \Illuminate\Support\Collection) {
                $availableShifts = $availableShifts->toArray();
            }

            $totalRoomsCount = Room::count();

            // Tính toán số phòng trống của các ca học
            $data = collect($availableShifts)->map(function ($shift) use ($start_date, $end_date, $days, $totalRoomsCount) {
                $reservedRoomsCount = Room::whereHas('schedules', function ($query) use ($shift, $start_date, $end_date, $days) {
                    $query->where('shift_id', $shift['id'])
                        ->where(function ($q) use ($start_date, $end_date) {
                            $q->whereBetween('start_date', [$start_date, $end_date])
                                ->orWhereBetween('end_date', [$start_date, $end_date])
                                ->orWhere([['start_date', '<=', $start_date], ['end_date', '>=', $end_date]]);
                        });

                    // Lọc theo ngày nếu có yêu cầu
                    if (!empty($days)) {
                        $query->whereHas('days', fn($q) => $q->whereIn('day_id', $days));
                    }
                })->count();

                // Tính số phòng còn trống
                $availableRoomsCount = $totalRoomsCount - $reservedRoomsCount;

                // Nếu không còn phòng trống thì bỏ qua ca học này
                if ($availableRoomsCount <= 0) {
                    return null; // Trả về null để loại bỏ ca học này trong quá trình lọc
                }

                return [
                    'id' => $shift['id'],
                    'name' => $shift['name'],
                    'start_time' => Carbon::parse($shift['start_time'])->format('H:i'),
                    'end_time' => Carbon::parse($shift['end_time'])->format('H:i'),
                    'total_rooms_count' => $totalRoomsCount,
                    'available_rooms_count' => $availableRoomsCount,
                ];
            });

            // Lọc và loại bỏ các ca học có phòng trống = 0 (được trả về null từ bước trước)
            $filteredData = $data->filter(function ($shift) {
                return $shift !== null;  // Chỉ giữ lại các ca học có phòng trống
            });

            return response()->json(['data' => $filteredData], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể lọc dữ liệu', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:shifts',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' =>  'required|date_format:H:i:s|after_or_equal:start_time',
        ], [
            'name.required' => 'Tên ca làm việc là bắt buộc.',
            'name.string' => 'Tên ca làm việc phải là chuỗi ký tự.',
            'name.max' => 'Tên ca làm việc không được dài quá 100 ký tự.',
            'name.unique' => 'Tên ca làm việc này đã tồn tại trong hệ thống.',
            'start_time.required' => 'Giờ bắt đầu là bắt buộc.',
            'start_time.date_format' => 'Giờ bắt đầu phải có định dạng H:i:s.',
            'end_time.required' => 'Giờ kết thúc là bắt buộc.',
            'end_time.date_format' => 'Giờ kết thúc phải có định dạng H:i:s.',
            'end_time.after_or_equal' => 'Giờ kết thúc phải lớn hơn hoặc bằng giờ bắt đầu.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $shift = Shift::create($data);

            return response()->json(['data' => $shift, 'message' => 'Tạo mới thành công'], 201);
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
            $shift = Shift::findOrFail($id);
            $data = [
                'id' => $shift->id,
                'name' => $shift->name,
                'start_time' => Carbon::parse($shift->start_time)->format('H:i'),
                'end_time' => Carbon::parse($shift->end_time)->format('H:i'),
            ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ca học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Shifts', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100|unique:shifts,name,' . $id,
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time' =>  'sometimes|date_format:H:i:s|after_or_equal:start_time',
        ], [
            'name.sometimes' => 'Tên ca làm việc không bắt buộc nhưng nếu có thì phải là chuỗi.',
            'name.string' => 'Tên ca làm việc phải là chuỗi ký tự.',
            'name.max' => 'Tên ca làm việc không được dài quá 100 ký tự.',
            'name.unique' => 'Tên ca làm việc này đã tồn tại trong hệ thống.',
            'start_time.sometimes' => 'Giờ bắt đầu không bắt buộc nhưng nếu có thì phải có định dạng H:i:s.',
            'start_time.date_format' => 'Giờ bắt đầu phải có định dạng H:i:s.',
            'end_time.sometimes' => 'Giờ kết thúc không bắt buộc nhưng nếu có thì phải có định dạng H:i:s.',
            'end_time.date_format' => 'Giờ kết thúc phải có định dạng H:i:s.',
            'end_time.after_or_equal' => 'Giờ kết thúc phải lớn hơn hoặc bằng giờ bắt đầu.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $shift = Shift::findOrFail($id);

            $data = $validator->validated();
            $shift->update($data);

            return response()->json(['data' => $shift, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ca học với ID: ' . $id], 404);
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
            $shift = Shift::findOrFail($id);
            $shift->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ca học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
