<?php

namespace App\Excel\Import;

use App\Models\Major;
use App\Models\User;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;

class TeacherImport implements ToModel, WithHeadingRow, WithValidation
{
    use Importable;

    public function model(array $row)
    {
        try {
            $major = Major::where('name', $row['nganh'])->first();
            $majorId = $major ? $major->id : null;

            if (!$majorId) {
                Log::warning("Major not found for row: ", $row);
                return null;
            }

            $dob = Carbon::createFromFormat('d/m/Y', $row['ngay_sinh'])->format('Y-m-d');

            $user = User::create([
                'name' => $row['ho_va_ten'],
                'email' => $row['email'],
                'phone' => $row['sdt'],
                'dob' => $dob,
                'gender' => $row['gioi_tinh'] == "Nam" ? "1" : "0",
                'ethnicity' => $row['dan_toc'],
                'address' => $row['dia_chi'],
                'password' => Hash::make('123456789'),
                'role_id' => 4,
            ]);

            return new Teacher([
                'user_id' => $user->id,
                'major_id' => $majorId,
                'teacher_code' => $row['mgv'],
                'status' => match ($row['trang_thai']) {
                    'Đang dạy' => "0",
                    'Tạm dừng' => "1",
                    'Kết thúc' => "2",
                    default => "Không xác định",
                }
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to import teacher data: ' . $e->getMessage());
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

            '*.nganh' => 'required|exists:majors,name',
            '*.mgv' => 'required|unique:teachers,teacher_code',
            '*.trang_thai' => 'required|in:Đang dạy,Tạm dừng,Kết thúc',
        ];
    }

    public function messages(): array
    {
        return [
            '*.ho_va_ten.required' => 'Họ và tên là bắt buộc.',
            '*.ho_va_ten.string' => 'Họ và tên phải là chuỗi ký tự.',
            '*.ho_va_ten.max' => 'Họ và tên không được vượt quá 100 ký tự.',

            '*.email.required' => 'Email là bắt buộc.',
            '*.email.string' => 'Email phải là chuỗi ký tự.',
            '*.email.email' => 'Email phải có định dạng hợp lệ.',
            '*.email.max' => 'Email không được vượt quá 255 ký tự.',
            '*.email.unique' => 'Email này đã được sử dụng.',

            '*.sdt.required' => 'Số điện thoại là bắt buộc.',
            '*.sdt.string' => 'Số điện thoại phải là chuỗi ký tự.',
            '*.sdt.max' => 'Số điện thoại không được vượt quá 10 ký tự.',
            '*.sdt.unique' => 'Số điện thoại này đã được sử dụng.',

            '*.ngay_sinh.required' => 'Ngày sinh là bắt buộc.',
            '*.ngay_sinh.date_format' => 'Ngày sinh phải có định dạng d/m/Y.',
            '*.ngay_sinh.before' => 'Ngày sinh phải trước ngày hôm nay.',

            '*.gioi_tinh.required' => 'Giới tính là bắt buộc.',
            '*.gioi_tinh.in' => 'Giới tính phải là "Nam" hoặc "Nữ".',

            '*.dan_toc.required' => 'Dân tộc là bắt buộc.',
            '*.dan_toc.string' => 'Dân tộc phải là chuỗi ký tự.',
            '*.dan_toc.max' => 'Dân tộc không được vượt quá 100 ký tự.',

            '*.dia_chi.required' => 'Địa chỉ là bắt buộc.',
            '*.dia_chi.string' => 'Địa chỉ phải là chuỗi ký tự.',
            '*.dia_chi.max' => 'Địa chỉ không được vượt quá 255 ký tự.',

            '*.nganh.required' => 'Ngành là bắt buộc.',
            '*.nganh.exists' => 'Ngành không tồn tại trong hệ thống.',

            '*.mgv.required' => 'Mã giảng viên là bắt buộc.',
            '*.mgv.unique' => 'Mã giảng viên này đã được sử dụng.',

            '*.trang_thai.required' => 'Trạng thái là bắt buộc.',
            '*.trang_thai.in' => 'Trạng thái phải là "Đang dạy", "Tạm dừng" hoặc "Kết thúc".',
        ];
    }
}


