<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Validator;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;

class TeacherImport implements ToModel, WithHeadingRow, WithValidation
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
            // 'password' => Hash::make($row['password']),
            'role_id'  => 4, 
        ]);

        return new Teacher([
            'user_id'      => $user->id,
            'major_id'     => $row['nganh'],              
            'teacher_code' => $row['mgv'],             
            'status'       => match($row['trang_thai']) {
                'Đang dạy' => "0",
                'Tạm dừng' => "1",
                'Kết thúc' => "2",
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
            // '*.password' => 'required|min:8',

            '*.nganh' => 'required|exists:majors,id',
            '*.mgv' => 'required|unique:teachers,teacher_code',
            '*.trang_thai' => 'required',
        ];
    }
}


