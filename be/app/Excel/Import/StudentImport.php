<?php

namespace App\Excel\Import;

use App\Models\User;
use App\Models\Student;
use App\Models\Course;
use App\Models\Major;
use App\Models\StudentMajor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Facades\Log;

class StudentImport implements ToModel, WithHeadingRow, WithValidation
{
    use Importable;

    public function model(array $row)
    {
        try {
            $course = Course::where('name', $row['khoa'])->first();
            $courseId = $course ? $course->id : null;
    
            $major = Major::where('name', $row['nganh'])->first();
            $majorId = $major ? $major->id : null;
    
            if (!$courseId || !$majorId) {
                Log::warning("Course or Major not found for row: ", $row);
                return null; 
            }
    
            $dob = Carbon::createFromFormat('d/m/Y', $row['ngay_sinh'])->format('Y-m-d');
    
            $user = User::create([
                'name'     => $row['ho_va_ten'],
                'email'    => $row['email'],
                'phone'    => $row['sdt'],
                'dob'      => $dob,
                'gender'   => $row['gioi_tinh'] == "Nam" ? "1" : "0",
                'ethnicity'=> $row['dan_toc'],
                'address'  => $row['dia_chi'],
                'password' => Hash::make('123456789'),
                'role_id'  => 3,
            ]);
    
            $student = Student::create([
                'user_id'          => $user->id,
                'course_id'        => $courseId,
                'current_semester' => $row['ki_hien_tai'],
                'student_code'     => $row['msv'],
                'status'           => match($row['trang_thai']) {
                    'Đang học'     => "0",
                    'Bảo lưu'      => "1",
                    'Hoàn thành'   => "2",
                    default        => "Không xác định",  
                },
            ]);
    
            StudentMajor::create([
                'student_id' => $student->id,
                'major_id'   => 1,
                'status'     => 0, 
            ]);
    
            StudentMajor::create([
                'student_id' => $student->id,
                'major_id'   => $majorId, 
                'status'     => 1, 
            ]);
    
            return $student;
        } catch (\Exception $e) {
            Log::error('Failed to import student data: ' . $e->getMessage());
            return null;
        }
    }
    

    public function rules(): array
    {
        return [
            '*.ho_va_ten' => 'required|string|max:100',
            '*.email' => 'required|string|email|max:255|unique:users',
            '*.sdt' => 'required|string|max:10|unique:users,phone',
            '*.ngay_sinh' => 'required|date_format:d/m/Y|before:today',
            '*.gioi_tinh' => 'required|in:Nam,Nữ',
            '*.dan_toc' => 'required|string|max:100',
            '*.dia_chi' => 'required|string|max:255',
            '*.khoa' => 'required|exists:courses,name',  
            '*.nganh' => 'required|exists:majors,name',   
            '*.ki_hien_tai' => 'required|integer|min:1',
            '*.msv' => 'required|unique:students,student_code',
            '*.trang_thai' => 'required|in:Đang học,Bảo lưu,Hoàn thành',
        ];
    }
}
