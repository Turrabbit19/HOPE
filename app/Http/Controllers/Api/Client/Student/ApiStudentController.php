<?php

namespace App\Http\Controllers\Api\Client\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ApiStudentController extends Controller
{
    public function detailStudent (string $id){
        try {
            $student = Student::with(['user', 'course', 'major' ])->findOrFail($id);
            
            $data = [
                'id' => $student->id,
                'avatar' => $student->user->avatar,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'phone' => $student->user->phone,
                'dob' => Carbon::parse($student->user->dob)->format('d/m/Y'),
                'gender' => $student->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $student->user->ethnicity,
                'address' => $student->user->address,
                'course_id' => $student->course->name,
                'major_id' => $student->major->name,
                'current_semester' => $student->current_semester,
                'student_code' => $student->student_code,
                'status' => match($student->status) {
                    '0' => "Đang học",
                    '1' => "Bảo lưu",
                    '2' => "Hoàn thành",
                    default => "Không xác định",
                }
            ];
           
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy tài khoản với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }
}
