@extends('client.master')
@section('content')
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Học phần đăng ký</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 20px;
            }

            h2 {
                color: #333;
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
                background-color: #ffffe0;
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
    </head>

    <body>
        <div class="breadcrumbs-area">
            {{-- <h3>Admin Dashboard</h3> --}}
            <ul>
                <li>
                    <a href="index.html">Trang chủ</a>
                </li>
                <li>Đăng ký môn học</li>
            </ul>
        </div>

        <div class="card dashboard-card-ten">
            <div class="card-body">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã môn</th>
                            <th>Tên môn học</th>
                            <th>Tín chỉ</th>

                        </tr>
                    </thead>
                    <tbody id="courseList">
                        <tr onclick="showCourseDetails(1)">
                            <td>1</td>
                            <td>WEB181</td>
                            <td>Nhập môn lập trình</td>
                            <td>2</td>

                        </tr>
                        <tr onclick="showCourseDetails(2)">
                            <td>2</td>
                            <td>WEB182</td>
                            <td>Lập trình PHP 3</td>
                            <td>2</td>

                        </tr>
                        <tr onclick="showCourseDetails(3)">
                            <td>3</td>
                            <td>WEB183</td>
                            <td>Lập trình PHP 2</td>
                            <td>3</td>

                        </tr>
                        <!-- Các môn khác có thể thêm tương tự -->
                    </tbody>
                </table>

                <!-- Phần lớp học phần để sinh viên chọn lớp -->
                <div id="classSection" class="class-section hidden">
                    <h2>Chọn lớp học</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Lớp học</th>
                                <th>Số lượng</th>
                                <th>Ca học</th>
                                <th>Trạng thái</th>
                                <th>Chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr onclick="showCourseDetails(1)">
                                <td>1</td>
                                <td>WEB183</td>
                                <td>Nhập môn lập trình</td>
                                <td>2</td>
                            </tr>
                            <tr onclick="showCourseDetails(2)">
                                <td>2</td>
                                <td>WEB182</td>
                                <td>Lập trình PHP 3</td>
                                <td>2</td>
                            </tr>
                            <tr onclick="showCourseDetails(3)">
                                <td>3</td>
                                <td>WEB181</td>
                                <td>Lập trình PHP 2</td>
                                <td>3</td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="button">Đăng ký</button>
                </div>
            </div>
        </div>

        <script>
            function showCourseDetails(courseId) {
                const classSection = document.getElementById('classSection');

                // Dữ liệu lớp học theo môn
                const courses = {
                    1: [{
                            id: 1,
                            class: 'Nhập môn lập trình',
                            slot: '38/40',
                            time: '7:00 - 9:00',
                            status: 'Hết chỗ'
                        },
                        {
                            id: 2,
                            class: 'Nhập môn lập trình',
                            slot: '30/40',
                            time: '9:00 - 11:00',
                            status: 'Còn chỗ'
                        },
                        {
                            id: 3,
                            class: 'Nhập môn lập trình',
                            slot: '32/40',
                            time: '12:00 - 14:00',
                            status: 'Còn chỗ'
                        }
                    ],
                    2: [{
                            id: 1,
                            class: 'Lập trình PHP 3',
                            slot: '35/40',
                            time: '8:00 - 10:00',
                            status: 'Còn chỗ'
                        },
                        {
                            id: 2,
                            class: 'Lập trình PHP 3',
                            slot: '29/40',
                            time: '10:00 - 12:00',
                            status: 'Còn chỗ'
                        }
                    ],
                    3: [{
                            id: 1,
                            class: 'Lập trình PHP 2',
                            slot: '40/40',
                            time: '13:00 - 15:00',
                            status: 'Hết chỗ'
                        },
                        {
                            id: 2,
                            class: 'Lập trình PHP 2',
                            slot: '30/40',
                            time: '15:00 - 17:00',
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
                        <td>${course.time}</td>
                        <td>${course.status}</td>
                        <td><input type="radio" name="classSelect"></td>
                    `;
                    tbody.appendChild(tr);
                });

                // Hiển thị phần chọn lớp học
                classSection.classList.remove('hidden');
            }
        </script>
    </body>

    </html>
@endsection
