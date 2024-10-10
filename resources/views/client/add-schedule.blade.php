@extends('client.layouts.master')

@section('content')
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 20px;
        }

        h2 {
            color: #333;
        }

        .course-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 60px;
        }

        .course-item {
            background-color: white;
            padding: 20px;
            border: 1px solid #ddd;
            text-align: center;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .course-item:hover {
            transform: scale(1.05);
            background-color: #f9f9f9;
        }

        .course-item h3 {
            margin-bottom: 10px;
        }

        .course-item p {
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 60px;
            background-color: white;
            table-layout: fixed;
            /* Ensures even spacing of columns */
        }

        th,
        td {
            padding: 12px 15px;
            text-align: left;
            border: 1px solid #ddd;
            word-wrap: break-word;
            /* Prevents text overflow */
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #f1f1f1;
            cursor: pointer;
        }

        .hidden {
            display: none;
        }

        .details {
            background-color: #ffffcc;
            padding: 15px;
            border: 1px solid #ddd;
        }

        .details table {
            width: 100%;
            margin-bottom: 10px;
        }

        .details th,
        .details td {
            border: none;
        }

        .details th {
            background-color: #f9f9f9;
        }

        .details p {
            margin: 5px 0;
        }

        .locked {
            color: red;
            font-weight: bold;
        }

        .button {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            text-align: center;
            display: inline-block;
            cursor: pointer;
            border-radius: 4px;
            width: 15%;
            /* Chiều rộng 20% */
            margin: 20px auto;
            /* Căn giữa */
            display: block;
            /* Để margin auto hoạt động */
        }

        .button:hover {
            background-color: #0056b3;
        }

        /* Phần thêm mới cho lớp học phần */
        .class-section {
            background-color: #e7f0fd;
            padding: 10px;
            border: 1px solid #ddd;
            margin-bottom: 20px;
            width: 100%;
            /* Full width */
        }

        .class-section table {
            width: 100%;
            /* Full width for tables in the class section */
        }

        .class-section th,
        .class-section td {
            padding: 10px;
            border: 1px solid #ddd;
        }

        .class-section th {
            background-color: #f2f2f2;
        }

        .class-section tr:hover {
            background-color: #f1f1f1;
        }
    </style>

    <div class="mb-3 breadcrumbs-area">
        <h2 class="bold text-center">Các môn học cần đăng kí</h2>
    </div>

    <div class="course-grid">
        <div class="course-item" onclick="showCourseDetails(1)">
            <h3>Nhập môn lập trình</h3>
            <p>Mã môn: NMLT</p>
            <p>Tín chỉ: 4</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(2)">
            <h3>Lập trình PHP 3</h3>
            <p>Mã môn: LTPHP3</p>
            <p>Tín chỉ: 3</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(3)">
            <h3>Lập trình PHP 2</h3>
            <p>Mã môn: LTPHP2</p>
            <p>Tín chỉ: 3</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(1)">
            <h3>Nhập môn lập trình</h3>
            <p>Mã môn: NMLT</p>
            <p>Tín chỉ: 4</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(2)">
            <h3>Lập trình PHP 3</h3>
            <p>Mã môn: LTPHP3</p>
            <p>Tín chỉ: 3</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(3)">
            <h3>Lập trình PHP 2</h3>
            <p>Mã môn: LTPHP2</p>
            <p>Tín chỉ: 3</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(1)">
            <h3>Nhập môn lập trình</h3>
            <p>Mã môn: NMLT</p>
            <p>Tín chỉ: 4</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(2)">
            <h3>Lập trình PHP 3</h3>
            <p>Mã môn: LTPHP3</p>
            <p>Tín chỉ: 3</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(3)">
            <h3>Lập trình PHP 2</h3>
            <p>Mã môn: LTPHP2</p>
            <p>Tín chỉ: 3</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(1)">
            <h3>Nhập môn lập trình</h3>
            <p>Mã môn: NMLT</p>
            <p>Tín chỉ: 4</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(2)">
            <h3>Lập trình PHP 3</h3>
            <p>Mã môn: LTPHP3</p>
            <p>Tín chỉ: 3</p>
        </div>
        <div class="course-item" onclick="showCourseDetails(3)">
            <h3>Lập trình PHP 2</h3>
            <p>Mã môn: LTPHP2</p>
            <p>Tín chỉ: 3</p>
        </div>
        <!-- Add more courses similarly for up to 9 items -->
    </div>

    <!-- Phần lớp học phần để sinh viên chọn lớp -->
    <div id="classSection" class="class-section hidden ">
        <h2 class="mb-3 bold text-center">Chọn lớp học</h2>
        <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Lớp học</th>
                    <th>Số lượng</th>
                    <th>Giảng viên</th>
                    <th>Thứ</th>
                    <th>Ca học</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Chọn</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <button class="button">Đăng ký</button>
    </div>

    <script>
        function showCourseDetails(courseId) {
            const classSection = document.getElementById('classSection');

            // Dữ liệu lớp học theo môn
            const courses = {
                1: [{
                        id: 1,
                        class: 'NMLT.01',
                        slot: '40/40',
                        teacher: 'khanhpq01',
                        day: '2,4,6',
                        shift: '1',
                        time: '7:00 - 9:00',
                        status: 'Hết chỗ'
                    },
                    {
                        id: 2,
                        class: 'NMLT.02',
                        slot: '30/40',
                        teacher: 'baovv04',
                        day: '3,5,7',
                        shift: '2',
                        time: '9:00 - 11:00',
                        status: 'Còn chỗ'
                    },
                    {
                        id: 3,
                        class: 'NMLT.03',
                        slot: '32/40',
                        teacher: 'khangtd01',
                        day: '2,4,6',
                        shift: '3',
                        time: '12:00 - 14:00',
                        status: 'Còn chỗ'
                    }
                ],
                2: [{
                        id: 1,
                        class: 'LTPHP3.01',
                        slot: '35/40',
                        teacher: 'longpt03',
                        day: '2,4,6',
                        shift: '2',
                        time: '9:00 - 11:00',
                        status: 'Còn chỗ'
                    },
                    {
                        id: 2,
                        class: 'LTPHP3.02',
                        slot: '29/40',
                        teacher: 'khanhpq01',
                        day: '3,5,7',
                        shift: '4',
                        time: '14:00 - 16:00',
                        status: 'Còn chỗ'
                    }
                ],
                3: [{
                        id: 1,
                        class: 'LTPHP2.01',
                        slot: '40/40',
                        teacher: 'khangtd01',
                        day: '3,5,7',
                        shift: '3',
                        time: '12:00 - 14:00',
                        status: 'Hết chỗ'
                    },
                    {
                        id: 2,
                        class: 'LTPHP2.02',
                        slot: '30/40',
                        teacher: 'baovv04',
                        day: '2,4,6',
                        shift: '4',
                        time: '14:00 - 16:00',
                        status: 'Còn chỗ'
                    },
                    {
                        id: 3,
                        class: 'LTPHP2.03',
                        slot: '34/40',
                        teacher: 'longpt03',
                        day: '3,5,7',
                        shift: '6',
                        time: '18:00 - 20:00',
                        status: 'Còn chỗ'
                    }
                ]
            };

            // Lấy danh sách lớp học dựa trên môn học được chọn
            const selectedCourse = courses[courseId];

            // Đổ dữ liệu vào bảng lớp học
            const tbody = document.querySelector('#classSection tbody');
            tbody.innerHTML = ''; // Xóa nội dung cũ

            selectedCourse.forEach(course => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td>${course.id}</td>
                        <td>${course.class}</td>
                        <td>${course.slot}</td>
                        <td>${course.teacher}</td>
                        <td>${course.day}</td>
                        <td>${course.shift}</td>
                        <td>${course.time}</td>
                        <td>${course.status}</td>
                        <td><input type="radio" name="classSelect"></td>
                    `;
                tbody.appendChild(tr);
            });

            // Hiển thị phần chọn lớp học
            classSection.classList.remove('hidden');

             // Tự động cuộn xuống phần chọn lớp
            classSection.scrollIntoView({ behavior: 'smooth' });
        }
    </script>
@endsection
