<<<<<<< HEAD
@extends('client.master')
@section('content')
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
        }

        .container {
            padding: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            table-layout: fixed;
        }

        th,
        td {
            padding: 10px;
            border: 1px solid #ccc;
        }

        th {
            background-color: #f4f4f4;
        }

        .event {
            padding: 10px;
            color: white;
            border-radius: 8px;
        }

        .dance {
            background-color: #00bcd4;
        }

        .yoga {
            background-color: #4caf50;
        }

        .music {
            background-color: #ffeb3b;
            color: black;
        }

        .art {
            background-color: #9c27b0;
        }

        .english {
            background-color: #e91e63;
        }

        .break {
            background-color: #ff5722;
        }
    </style>
    <div class="breadcrumbs-area">
        {{-- <h3>Admin Dashboard</h3> --}}
        <ul>
            <li>
                <a href="index.html">Trang chủ</a>
            </li>
            <li>Lịch học</li>
        </ul>
    </div>
    <div class="col-12-xxxl col-12">
        <div class="card dashboard-card-six">
            <div class="card-body">
                <div class="container">
                    <table>
                        <thead>
                            <tr>
                                <th>THỜI GIAN</th>
                                <th>THỨ HAI</th>
                                <th>THỨ BA</th>
                                <th>THỨ TƯ</th>
                                <th>THỨ NĂM</th>
                                <th>THỨ SÁU</th>
                                <th>THỨ BẢY</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ca 1</td>
                                <td>
                                    <div class="event dance">Pháp luật<br>7:10-9:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                   
                                </td>
                                <td>
                                    <div class="event dance">Pháp luật<br>7:10-9:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                 
                                </td>
                                <td>
                                    <div class="event dance">Pháp luật<br>7:10-9:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                  
                                </td>
                            </tr>
                            <tr>
                                <td>Ca 2</td>
                                <td>
                                   
                                </td>
                                <td>
                                    <div class="event music">Lập trình PHP2<br>9:20-11:20<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                              
                                </td>
                                <td>
                                    <div class="event music">Lập trình PHP2<br>9:20-11:20<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                  
                                </td>
                                <td>
                                    <div class="event music">Lập trình PHP2<br>9:20-11:20<br><small>baovvph36087</small></div>
                                </td>
                            </tr>
                            <tr>
                                <td>Ca 3</td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>Ca 4</td>
                                <td>
                                    <div class="event yoga">Quản trị Website<br>14:10-16:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                  
                                </td>
                                <td>
                                    <div class="event yoga">Quản trị Website<br>14:10-16:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                  
                                </td>
                                <td>
                                    <div class="event yoga">Quản trị Website<br>14:10-16:10<br><small>baovvph36087</small></div>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Ca 5</td>
                                <td>
                                   
                                </td>
                                <td>
                                    <div class="event english">Chính trị<br>16:20-18:20<br><small>baovvph36087</small></div>
                                </td>
                                <td></td>
                                <td>
                                    <div class="event english">Chính trị<br>16:20-18:20<br><small>baovvph36087</small></div>
                                </td>
                                <td></td>
                                <td>
                                    <div class="event english">Chính trị<br>16:20-18:20<br><small>baovvph36087</small></div>
                                </td>
                            </tr>
                            <tr>
                                <td>Ca 6</td>
                                <td>
                                  
                                </td>
                                <td>
                                 
                                </td>
                                <td></td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                              
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
            </div>
        </div>
    </div>
@endsection
=======
@extends('client.layouts.master')

@section('content')
<div class="schedule-container">
    <!-- Header Thời khóa biểu -->
       <div class="mb-3">
        <button class="btn btn-secondary">Block 1 - Kì Fall - 2024</button>
        <button class="btn btn-secondary">Tuần 4 (09/09/2024 - 15/09/2024)</button>
       </div>
    
    <!-- Bảng thời khóa biểu -->
    <table class="table table-bordered schedule-table">
        <thead>
            <tr>
                <th>Ca</th>
                <th>Thứ 2</th>
                <th>Thứ 3</th>
                <th>Thứ 4</th>
                <th>Thứ 5</th>
                <th>Thứ 6</th>
                <th>Thứ 7</th>
                <th>Chủ nhật</th>
                <th>Thời gian</th>
            </tr>
        </thead>
        <tbody>
            <!-- Lặp qua các ca học -->
            <tr>
                <td>Ca 1</td>
                <td class="course green" data-details="Ngày học: Thứ 2, Phòng học: P101, Lớp học: Lập trình PHP3">Lập trình PHP3</td>
                <td></td>
                <td class="course red" data-details="Ngày học: Thứ 4, Phòng học: P102, Lớp học: Lập trình PHP3">Lập trình PHP3</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>07:15 - 09:15</td>
            </tr>
            <tr>
                <td>Ca 2</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>09:15 - 11:15</td>
            </tr>
            <tr>
                <td>Ca 3</td>
                <td class="course green" data-details="Ngày học: Thứ 2, Phòng học: P103, Lớp học: Khởi sự doanh nghiệp">Khởi sự doanh nghiệp</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>13:30 - 15:30</td>

            </tr>
            <tr>
                <td>Ca 4</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>15:30 - 17:30</td>
            </tr>
            <tr>
                <td>Ca 5</td>
                <td class="course green" data-details="Ngày học: Thứ 2, Phòng học: P104, Lớp học: JS nâng cao">JS nâng cao</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>18:00 - 20:00</td>
            </tr>
            <tr>
                <td>Ca 6</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>20:00 - 22:00</td>
            </tr>
        </tbody>
    </table>

    <!-- Modal hiển thị chi tiết -->
    <div class="course-details" id="course-details">
        <h5>Chi tiết ca học</h5>
        <p><strong>Ngày học:</strong> <span id="course-day"></span></p>
        <p><strong>Phòng học:</strong> <span id="course-room"></span></p>
        <p><strong>Lớp học:</strong> <span id="course-class"></span></p>
    </div>
</div>

<!-- CSS -->
<style>
    .schedule-container {
        padding: 20px;
        background-color: #e7f0fd; /* Màu nền */
    }

    .schedule-header {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }

    .schedule-table {
        width: 100%;
        text-align: center;
        background-color: white;
    }

    .schedule-table th, .schedule-table td {
        vertical-align: middle;
        padding: 15px;
    }

    .schedule-table th {
        background-color: #9bc2e6;
        color: white;
    }

    /* Màu môn học */
    .course {
        position: relative;
        cursor: pointer;
        font-weight: bold;
    }

    .green {
        background-color: #60f265; /* Màu xanh */
    }

    .red {
        background-color: #f27582; /* Màu đỏ */
    }

    .course:hover {
        background-color: #0d6efd;
        color: white;
    }

    /* Chi tiết ca học */
    .course-details {
        display: none;
        position: absolute;
        padding: 15px;
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        width: 200px;
    }

    .course-details h5 {
        background-color: #0d6efd;
        color: white;
        padding: 5px;
        margin: 0 0 10px;
    }

    .course-details p {
        margin: 5px 0;
    }
</style>

<script>
 // Xử lý hover hiển thị modal chi tiết ca học
const courses = document.querySelectorAll('.course');
const detailsModal = document.getElementById('course-details');
const courseDay = document.getElementById('course-day');
const courseRoom = document.getElementById('course-room');
const courseClass = document.getElementById('course-class');

courses.forEach(course => {
    course.addEventListener('mouseenter', function() {
        const details = this.getAttribute('data-details').split(',');
        courseDay.textContent = details[0].split(': ')[1];
        courseRoom.textContent = details[1].split(': ')[1];
        courseClass.textContent = details[2].split(': ')[1];

        const rect = this.getBoundingClientRect();
        detailsModal.style.top = (rect.top + window.scrollY + rect.height + 10) + 'px';
        detailsModal.style.left = rect.left + 'px';
        detailsModal.style.display = 'block';
    });

    course.addEventListener('mouseleave', function() {
        detailsModal.style.display = 'none';
    });
});


</script>
@endsection
>>>>>>> khanh
