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
           
            $courses = Course::pluck('id', 'name')->toArray();
            $majors = Major::pluck('id', 'name')->toArray();
            $courseId = $courses[$row['khoa']] ?? null;
            $majorId = $majors[$row['nganh']] ?? null;

            if (!$courseId || !$majorId) {
                Log::warning('Không tìm thấy Course hoặc Major cho dòng:', $row);
                return null;
            }

            $dob = Carbon::parse($row['ngay_sinh'])->format('Y-m-d');

            $user = User::create([
                'name' => $row['ho_va_ten'],
                'email' => $row['email'],
                'phone' => $row['sdt'],
                'dob' => $dob,
                'gender' => $row['gioi_tinh'] == "Nam" ? "1" : "0",
                'ethnicity' => $row['dan_toc'],
                'address' => $row['dia_chi'],
                'password' => Hash::make('123456789'),
                'role_id' => 3,
            ]);


            $student = Student::create([
                'user_id' => $user->id,
                'course_id' => $courseId,
                'current_semester' => $row['ki_hien_tai'],
                'student_code' => $row['msv'],
                'status' => match ($row['trang_thai']) {
                    'Đang học' => "0",
                    'Bảo lưu' => "1",
                    'Hoàn thành' => "2",
                    default => "Không xác định",
                },
            ]);

            StudentMajor::create([
                'student_id' => $student->id,
                'major_id' => 1,
                'status' => 0,
            ]);

            StudentMajor::create([
                'student_id' => $student->id,
                'major_id' => $majorId,
                'status' => 1,
            ]);

            return $student;
        } catch (\Exception $e) {
            Log::error('Lỗi khi import dòng: ', ['row' => $row, 'message' => $e->getMessage()]);
            return null;
        }
    }

    private function mapStatus(string $status)
    {
        $statusMap = [
            'Đang học' => '0',
            'Bảo lưu'  => '1',
            'Hoàn thành' => '2'
        ];
        return $statusMap[$status] ?? 'Không xác định';
    }


    public function rules(): array
    {
        return [
            '*.ho_va_ten' => 'required|string|max:100',
            '*.email' => 'required|string|email|max:255|unique:users',
            '*.sdt' => 'required|string|max:10|unique:users,phone',
            '*.ngay_sinh' => 'required|before:today',
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

    public function messages(): array
    {
        return [
            '*.ho_va_ten.required' => 'Họ và tên là bắt buộc.',
            '*.ho_va_ten.string' => 'Họ và tên phải là chuỗi.',
            '*.ho_va_ten.max' => 'Họ và tên không được vượt quá 100 ký tự.',
            '*.email.required' => 'Email là bắt buộc.',
            '*.email.email' => 'Email phải có định dạng hợp lệ.',
            '*.email.max' => 'Email không được vượt quá 255 ký tự.',
            '*.email.unique' => 'Email này đã được sử dụng.',
            '*.sdt.required' => 'Số điện thoại là bắt buộc.',
            '*.sdt.max' => 'Số điện thoại không được vượt quá 10 ký tự.',
            '*.sdt.unique' => 'Số điện thoại này đã được sử dụng.',
            '*.ngay_sinh.required' => 'Ngày sinh là bắt buộc.',
            '*.ngay_sinh.before' => 'Ngày sinh phải trước ngày hôm nay.',
            '*.gioi_tinh.required' => 'Giới tính là bắt buộc.',
            '*.gioi_tinh.in' => 'Giới tính phải là "Nam" hoặc "Nữ".',
            '*.dan_toc.required' => 'Dân tộc là bắt buộc.',
            '*.dan_toc.max' => 'Dân tộc không được vượt quá 100 ký tự.',
            '*.dia_chi.required' => 'Địa chỉ là bắt buộc.',
            '*.dia_chi.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            '*.khoa.required' => 'Khoa là bắt buộc.',
            '*.khoa.exists' => 'Khoa không tồn tại trong hệ thống.',
            '*.nganh.required' => 'Ngành là bắt buộc.',
            '*.nganh.exists' => 'Ngành không tồn tại trong hệ thống.',
            '*.ki_hien_tai.required' => 'Kỳ hiện tại là bắt buộc.',
            '*.ki_hien_tai.integer' => 'Kỳ hiện tại phải là một số nguyên.',
            '*.ki_hien_tai.min' => 'Kỳ hiện tại phải lớn hơn hoặc bằng 1.',
            '*.msv.required' => 'Mã sinh viên là bắt buộc.',
            '*.msv.unique' => 'Mã sinh viên này đã được sử dụng.',
            '*.trang_thai.required' => 'Trạng thái là bắt buộc.',
            '*.trang_thai.in' => 'Trạng thái phải là "Đang học", "Bảo lưu" hoặc "Hoàn thành".',
        ];
    }
}
