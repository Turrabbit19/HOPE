<?php

namespace App\Excel\Export;

use App\Models\Student;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;

class StudentExport implements FromCollection, WithHeadings, WithEvents
{
    public $styleHeader = [
        'borders' => [
            'outline' => [
                'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                'color' => ['argb' => '000000'],
            ],
        ],
        'alignment' => [
            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            'wrapText' => true
        ],
        'fill' => [
            'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
            'startColor'    => ['argb' => 'ededed'],
        ],
        'font'  => [
            'size'  => 14,
            'name'  => 'Times New Roman',
        ],
    ];

    public $styleCell = [
        'borders' => [
            'outline' => [
                'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                'color' => ['argb' => '000000'],
            ],
        ],
        'alignment' => [
            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            'wrapText' => true
        ],
        'fill' => [
            'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
            'startColor'    => ['argb' => 'ededed'],
        ],
        'font'  => [
            'size'  => 14,
            'name'  => 'Times New Roman',
        ],
    ];

    public function collection()
    {
        $outputArr = [];
        $students = Student::with(['user', 'course', 'majors'])->get();

        $data = $students->map(function($student){
            $mainMajor = $student->majors->firstWhere('status', 1)?->major?->name ?? 'Không xác định';
            return [
                'name' => $student->user->name,
                'email' => $student->user->email,
                'phone' => $student->user->phone,
                'dob' => Carbon::parse($student->user->dob)->format('d/m/Y'),
                'gender' => $student->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $student->user->ethnicity,
                'address' => $student->user->address,
                'course_name' => $student->course->name,
                'major_name' => $mainMajor,
                'student_code' => $student->student_code,
                'current_semester' => $student->current_semester,
                'status' => match($student->status) {
                    '0' => "Đang học",
                    '1' => "Bảo lưu",
                    '2' => "Hoàn thành",
                    default => "Không xác định",
                }
            ];
        });
        foreach($data as $key => $value){
            array_push($outputArr, [
                $key + 1,
                $value['student_code'],
                $value['name'],
                $value['email'],
                $value['phone'],
                $value['dob'],
                $value['gender'],
                $value['ethnicity'],
                $value['address'],
                $value['course_name'],
                $value['major_name'],
                $value['current_semester'],
                $value['status']
            ]);
        }
        return collect($outputArr);
    }
    public function headings() :array {
        return [
            'STT',
            'MSV',
            'Họ và tên',
            'Email',
            'SĐT',
            'Ngày sinh',
            'Giới tính',
            'Dân tộc',
            'Địa chỉ',
            'Khóa',
            'Ngành',
            'Kì hiện tại',
            'Trạng thái',
        ];
    }

    public function registerEvents(): array{
        return [
            AfterSheet::class    => function(AfterSheet $event) {
                $event->sheet->getDelegate()->setTitle("List Student");

                $event->sheet->getDelegate()->getStyle("A1:M1")->getActiveSheet()->getRowDimension('1')->setRowHeight(35);

                $event->sheet->getDelegate()->getStyle("A")->getActiveSheet()->getColumnDimension('A')->setWidth(10);
                $event->sheet->getDelegate()->getStyle("B")->getActiveSheet()->getColumnDimension('B')->setWidth(15);
                $event->sheet->getDelegate()->getStyle("C")->getActiveSheet()->getColumnDimension('C')->setWidth(30);
                $event->sheet->getDelegate()->getStyle("D")->getActiveSheet()->getColumnDimension('D')->setWidth(35);
                $event->sheet->getDelegate()->getStyle("E")->getActiveSheet()->getColumnDimension('E')->setWidth(20);
                $event->sheet->getDelegate()->getStyle("F")->getActiveSheet()->getColumnDimension('F')->setWidth(25);
                $event->sheet->getDelegate()->getStyle("G")->getActiveSheet()->getColumnDimension('G')->setWidth(15);
                $event->sheet->getDelegate()->getStyle("H")->getActiveSheet()->getColumnDimension('H')->setWidth(15);
                $event->sheet->getDelegate()->getStyle("I")->getActiveSheet()->getColumnDimension('I')->setWidth(35);
                $event->sheet->getDelegate()->getStyle("J")->getActiveSheet()->getColumnDimension('J')->setWidth(15);
                $event->sheet->getDelegate()->getStyle("K")->getActiveSheet()->getColumnDimension('K')->setWidth(22);
                $event->sheet->getDelegate()->getStyle("L")->getActiveSheet()->getColumnDimension('L')->setWidth(15);
                $event->sheet->getDelegate()->getStyle("M")->getActiveSheet()->getColumnDimension('M')->setWidth(20);

                $event->sheet->getDelegate()->getStyle("A1:M1")
                    ->applyFromArray($this->styleHeader);


                $validation = $event->sheet->getDataValidation("E2:E9");
                $validation->setType(DataValidation::TYPE_LIST);
                $validation->setErrorStyle(DataValidation::STYLE_INFORMATION);
                $validation->setAllowBlank(false);
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                $validation->setShowDropDown(true);
                $validation->setErrorTitle('Input error');
                $validation->setError('Value is not in list.');
                $validation->setPromptTitle('Pick from list');
                $validation->setPrompt('Please pick a value from the drop-down list.');
                $validation->setFormula1('"Nam,Nữ"');
            },
        ];
    }

}
