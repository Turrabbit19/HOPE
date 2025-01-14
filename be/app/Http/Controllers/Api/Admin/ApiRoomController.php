<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\Shift;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;

class ApiRoomController extends Controller
{
    public function index(Request $request)
    {
        try {
            $room = $request->input('room', 'all');
            $cacheKey = $room === "all" ? 'rooms_all' : "rooms_search_{$room}";
            $cacheTTL = 300;

            $cachedData = Redis::get($cacheKey);

            if ($cachedData) {
                $data = json_decode($cachedData, true);
            } else {
                $date = Carbon::today()->toDateString();
                $currentTime = Carbon::now();

                $rooms = $room === "all"
                    ? Room::all()
                    : Room::where('name', 'like', "%$room%")->get();

                $schedules = Schedule::with(['lessons', 'shift'])
                    ->whereHas('lessons', function ($query) use ($date) {
                        $query->where('study_date', $date);
                    })
                    ->get();

                $data = $rooms->map(function ($room) use ($schedules, $currentTime) {
                    $roomSchedules = $schedules->filter(function ($schedule) use ($room, $currentTime) {
                        if ($schedule->room_id != $room->id) {
                            return false;
                        }

                        $shift = $schedule->shift;
                        if ($shift && $currentTime->between($shift->start_time, $shift->end_time)) {
                            return true;
                        }

                        return false;
                    });

                    $status = $roomSchedules->isNotEmpty() ? 'Đang sử dụng' : 'Đang trống';

                    return [
                        'id' => $room->id,
                        'name' => $room->name,
                        'status' => $status,
                    ];
                });

                Redis::setex($cacheKey, $cacheTTL, json_encode($data));
            }

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Rooms',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAvailableRooms(Request $request)
    {
        try {
            $start_date = Carbon::parse($request->input('start_date'))->startOfDay();
            $end_date = Carbon::parse($request->input('end_date'))->endOfDay();
            $days = $request->input('days_of_week', []);
            $shiftId = $request->input('shift_id');

            $shift = Shift::find($shiftId);
            if (!$shift) {
                return response()->json(['error' => 'Không tìm thấy ca học'], 404);
            }

            $cacheKey = "available_rooms_shift_{$shiftId}_{$start_date}_{$end_date}";

            $cachedData = Redis::get($cacheKey);

            if ($cachedData) {
                $availableRooms = json_decode($cachedData, true);
            } else {
                $rooms = Room::whereDoesntHave('schedules', function ($query) use ($shiftId, $start_date, $end_date, $days) {
                    $query->where('shift_id', $shiftId)
                        ->where(function ($q) use ($start_date, $end_date) {
                            $q->whereBetween('start_date', [$start_date, $end_date])
                                ->orWhereBetween('end_date', [$start_date, $end_date])
                                ->orWhere([
                                    ['start_date', '<=', $start_date],
                                    ['end_date', '>=', $end_date]
                                ]);
                        });
                    if (!empty($days)) {
                        $query->whereHas('days', fn($q) => $q->whereIn('day_id', $days));
                    }
                })->get(['id', 'name']);

                $availableRooms = [];

                foreach ($rooms as $room) {
                    $hasScheduled = $room->schedules()
                        ->where('shift_id', $shiftId)
                        ->where(function ($query) use ($start_date, $end_date, $days) {
                            $query->where(function ($q) use ($start_date, $end_date) {
                                $q->whereBetween('start_date', [$start_date, $end_date])
                                    ->orWhereBetween('end_date', [$start_date, $end_date])
                                    ->orWhere([
                                        ['start_date', '<=', $start_date],
                                        ['end_date', '>=', $end_date]
                                    ]);
                            });
                            if (!empty($days)) {
                                $query->whereHas('days', fn($dayQuery) => $dayQuery->whereIn('day_id', $days));
                            }
                        })
                        ->exists();

                    if (!$hasScheduled) {
                        $availableRooms[] = [
                            'id' => $room->id,
                            'name' => $room->name,
                        ];
                    }
                }

                Redis::setex($cacheKey, 3600, json_encode($availableRooms));
            }

            return response()->json(['data' => $availableRooms], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể lấy danh sách phòng trống', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:19|unique:rooms',
            'status' => 'boolean',
        ], [
            'name.unique' => 'Tên phòng học đã tồn tại.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $room = Room::create($data);
            $this->updateRoomsCache();
            return response()->json(['data' => $room, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $room = Room::findOrFail($id);
            $data = [
                'id' => $room->id,
                'name' => $room->name,
                'status' => $room->status ? "Đang trống" : "Đang hoạt động",
            ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phòng học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Rooms', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:19|unique:rooms,name,' . $id,
            'status' => 'sometimes|boolean',
        ], [
            'name.string' => 'Tên phòng học phải là chuỗi ký tự.',
            'name.max' => 'Tên phòng học không được vượt quá 19 ký tự.',
            'name.unique' => 'Tên phòng học đã tồn tại.',

            'status.boolean' => 'Trạng thái phải là giá trị boolean (true/false hoặc 0/1).',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $room = Room::findOrFail($id);

            $data = $validator->validated();
            $room->update($data);
            $this->updateRoomsCache();
            return response()->json(['data' => $room, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phòng học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $room = Room::findOrFail($id);
            $room->delete();
            $this->updateRoomsCache();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phòng học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    private function updateRoomsCache()
    {
        Redis::del('rooms_all');
    }
}
