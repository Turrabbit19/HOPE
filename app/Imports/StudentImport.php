<?php
namespace App\Imports;

use App\Models\User;
use App\Models\Student;
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
            'dob'      => $row['ngay_sinh'],
            'gender'   => $row['gioi_tinh'], 
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
            'status'           => $row['trang_thai'],        
        ]);
    }

    
    public function rules(): array
    {
        return [
            '*.ho_va_ten' => 'required|string|max:100',
            '*.email' => 'required|string|email|max:255|unique:users',
            '*.sdt' => 'required|string|max:10|unique:users,phone', 
            '*.ngay_sinh' => 'required|date|before:today',
            '*.gioi_tinh' => 'required|boolean',
            '*.dan_toc' => 'required|string|max:100',
            '*.dia_chi' => 'required|string|max:255',
            '*.password' => 'required|min:8',

            '*.khoa' => 'required|exists:courses,id',
            '*.nganh' => 'required|exists:majors,id',
            '*.ki_hien_tai' => 'required|integer|min:1',
            '*.msv' => 'required|unique:students,student_code',
            '*.trang_thai' => 'integer|in:0,1,2',
        ];
    }
}
