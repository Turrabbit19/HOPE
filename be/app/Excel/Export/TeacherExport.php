<?php

namespace App\Excel\Export;

use App\Models\Teacher;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;

class TeacherExport implements FromCollection, WithHeadings, WithEvents
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
        $teachers = Teacher::with(['user', 'major'])->get();
        $data = $teachers->map(function($teacher){
            return [
                'name' => $teacher->user->name,
                'email' => $teacher->user->email,
                'phone' => $teacher->user->phone,
                'dob' => Carbon::parse($teacher->user->dob)->format('d/m/Y'),
                'gender' => $teacher->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $teacher->user->ethnicity,
                'address' => $teacher->user->address,
                'major_name' => $teacher->major->name,
                'teacher_code' => $teacher->teacher_code,
                'status' => match($teacher->status) {
                    '0' => "Đang dạy",
                    '1' => "Tạm dừng",
                    '2' => "Kết thúc",
                    default => "Không xác định",
                }
            ];
        });
        foreach($data as $key => $value){
            array_push($outputArr, [
                $key + 1,
                $value['teacher_code'],
                $value['name'],
                $value['email'],
                $value['phone'],
                $value['dob'],
                $value['gender'],
                $value['ethnicity'],
                $value['address'],
                $value['major_name'],
                $value['status']
            ]);
        }
        return collect($outputArr);
    }

    public function headings() :array {
        return [
            'STT',
            'MGV',
            'Họ và tên',
            'Email',
            'SĐT',
            'Ngày sinh',
            'Giới tính',
            'Dân tộc',
            'Địa chỉ',
            'Ngành',
            'Trạng thái',
        ];
    }

    public function registerEvents(): array{
        return [
            AfterSheet::class    => function(AfterSheet $event) {
                $event->sheet->getDelegate()->setTitle("List Teacher");

                $event->sheet->getDelegate()->getStyle("A1:K1")->getActiveSheet()->getRowDimension('1')->setRowHeight(35);

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
               
                $event->sheet->getDelegate()->getStyle("A1:K1")
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
