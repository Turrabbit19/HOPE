<?php
namespace App\Imports;

use App\Models\User;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Validator;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;

class StudentImport implements ToModel, WithHeadingRow, WithValidation
{
    use Importable;

    public function model(array $row)
    {
        $user = User::create([
            'name'     => $row['ho_va_ten'], 
            'email'    => $row['email'],
            'phone'    => $row['sdt'],       
            'dob'      => Carbon::parse($row['ngay_sinh'])->format('Y/m/d'),
            'gender'   => $row['gioi_tinh'] == "Nam" ? "1" : "0", 
            'ethnicity'=> $row['dan_toc'],   
            'address'  => $row['dia_chi'],   
            'password' => Hash::make($row['password']),
            'role_id'  => 3, 
        ]);

        return new Student([
            'user_id'          => $user->id,
            'course_id'        => $row['khoa'],              
            'major_id'         => $row['nganh'],             
            'current_semester' => $row['ki_hien_tai'],       
            'student_code'     => $row['msv'],                
            'status'           => match($row['trang_thai']) {
                'Đang học'     => "0",
                'Bảo lưu'      => "1",
                'Hoàn thành'   => "2",
                default => "Không xác định",
            } 
        ]);
    }

    
    public function rules(): array
    {
        return [
            '*.ho_va_ten' => 'required|string|max:100',
            '*.email' => 'required|string|email|max:255|unique:users',
            '*.sdt' => 'required|string|max:10|unique:users,phone', 
            '*.ngay_sinh' => 'required|before:today',
            '*.gioi_tinh' => 'required',
            '*.dan_toc' => 'required|string|max:100',
            '*.dia_chi' => 'required|string|max:255',
            '*.password' => 'required|min:8',

            '*.khoa' => 'required|exists:courses,id',
            '*.nganh' => 'required|exists:majors,id',
            '*.ki_hien_tai' => 'required|integer|min:1',
            '*.msv' => 'required|unique:students,student_code',
            '*.trang_thai' => 'required',
        ];
    }
}
