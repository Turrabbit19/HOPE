@extends('client.layouts.master')

@section('content')
    <div class="row">
        <div class="col-xxl-8 d-flex">
            <div class="row flex-fill">

                <div class="col-xl-6 d-flex">
                    <div class="flex-fill">
                        <div class="card bg-dark position-relative">
                            <div class="card-body">
                                <div class="d-flex align-items-center row-gap-3 mb-3">
                                    <div class="avatar avatar-xxl rounded flex-shrink-0 me-3">
                                        <img src="assets/img/students/student-13.jpg" alt="Img">
                                    </div>
                                    <div class="d-block">
                                        <h3 class="text-truncate text-white mb-1">Phạm Quốc Khanh</h3>
                                        <div class="d-flex align-items-center flex-wrap row-gap-2 text-gray-2">
                                            <span>MSV : PH38668</span>
                                            <a href=""></a>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="text-center profile-footer flex-wrap row-gap-3 pt-4">
                                    <a href="edit-student.html" class="btn btn-primary">Thông tin cá nhân</a>
                                </div>
                                <div class="student-card-bg">
                                    <img src="assets/img/bg/circle-shape.png" alt="Bg">
                                    <img src="assets/img/bg/shape-02.png" alt="Bg">
                                    <img src="assets/img/bg/shape-04.png" alt="Bg">
                                    <img src="assets/img/bg/blue-polygon.png" alt="Bg">
                                </div>
                            </div>
                        </div>
                        <div class="card flex-fill">
                            <div class="card-header d-flex align-items-center justify-content-between">
                                <h4 class="card-title">Lớp học hôm nay</h4>
                                <div class="d-inline-flex align-items-center class-datepick">
                                    <span class="icon"><i class="ti ti-chevron-left me-2"></i></span>
                                    <input type="text" class="form-control datetimepicker border-0"
                                        placeholder="16 May 2024">
                                    <span class="icon"><i class="ti ti-chevron-right"></i></span>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="card mb-3">
                                    <div class="d-flex align-items-center justify-content-between flex-wrap p-3 pb-1">
                                        <div class="d-flex align-items-center flex-wrap mb-2">
                                            <span class="avatar avatar-lg flex-shrink-0 rounded me-2">
                                                <img src="assets/img/parents/parent-07.jpg" alt="Profile">
                                            </span>
                                            <div>
                                                <h6 class="mb-1 text-decoration-line-through">PHP3</h6>
                                                <span><i class="ti ti-clock me-2"></i>09:00 - 09:45
                                                    AM</span>
                                            </div>
                                        </div>
                                        <span class="badge badge-soft-success shadow-none mb-2"><i
                                                class="ti ti-circle-filled fs-8 me-1"></i>Hoàn thành</span>
                                    </div>
                                </div>
                                <div class="card mb-3">
                                    <div class="d-flex align-items-center justify-content-between flex-wrap p-3 pb-1">
                                        <div class="d-flex align-items-center flex-wrap mb-2">
                                            <span class="avatar avatar-lg flex-shrink-0 rounded me-2">
                                                <img src="assets/img/parents/parent-02.jpg" alt="Profile">
                                            </span>
                                            <div>
                                                <h6 class="mb-1 text-decoration-line-through">PTCN2</h6>
                                                <span><i class="ti ti-clock me-2"></i>10:45 - 11:30
                                                    AM</span>
                                            </div>
                                        </div>
                                        <span class="badge badge-soft-success shadow-none mb-2"><i
                                                class="ti ti-circle-filled fs-8 me-1"></i>Hoàn Thành</span>
                                    </div>
                                </div>
                                <div class="card mb-0">
                                    <div class="d-flex align-items-center justify-content-between flex-wrap p-3 pb-1">
                                        <div class="d-flex align-items-center flex-wrap mb-2">
                                            <span class="avatar avatar-lg flex-shrink-0 rounded me-2">
                                                <img src="assets/img/profiles/avatar-17.jpg" alt="Profile">
                                            </span>
                                            <div>
                                                <h6 class="mb-1">JS Nâng Cao</h6>
                                                <span><i class="ti ti-clock me-2"></i>11:30 - 12:15
                                                    AM</span>
                                            </div>
                                        </div>
                                        <span class="badge badge-soft-warning shadow-none mb-2"><i
                                                class="ti ti-circle-filled fs-8 me-1"></i>Sắp tới</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="col-xl-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h4 class="card-title">Điểm danh</h4>
                            <div class="card-dropdown">
                                <a href="javascript:void(0);" class="dropdown-toggle p-2" data-bs-toggle="dropdown">
                                    <span><i class="ti ti-calendar-due"></i></span>
                                    Tuần này
                                </a>
                                <div class="dropdown-menu  dropdown-menu-end">
                                    <ul>
                                        <li>
                                            <a href="javascript:void(0);">This Week</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);">Last Week</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);">Last Month</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="attendance-chart">
                                <p class="mb-3"><i class="ti ti-calendar-heart text-primary me-2"></i>No of
                                    total working days <span class="fw-medium text-dark"> 28 Days</span></p>
                                <div class="border rounded p-3">
                                    <div class="row">
                                        <div class="col text-center border-end">
                                            <p class="mb-1">Present</p>
                                            <h5>25</h5>
                                        </div>
                                        <div class="col text-center border-end">
                                            <p class="mb-1">Absent</p>
                                            <h5>2</h5>
                                        </div>
                                        <div class="col text-center">
                                            <p class="mb-1">Halfday</p>
                                            <h5>0</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <div id="attendance_chart"></div>
                                </div>
                                <div class="bg-light-300 rounded border p-3 mb-0">
                                    <div class="d-flex align-items-center justify-content-between flex-wrap mb-1">
                                        <h6 class="mb-2">Last 7 Days </h6>
                                        <p class="fs-12 mb-2">14 May 2024 - 21 May 2024</p>
                                    </div>
                                    <div class="d-flex align-items-center rounded gap-1 flex-wrap">
                                        <a href="javascript:void(0);" class="badge badge-lg bg-success text-white">M</a>
                                        <a href="javascript:void(0);" class="badge badge-lg bg-success text-white">T</a>
                                        <a href="javascript:void(0);" class="badge badge-lg bg-success text-white">W</a>
                                        <a href="javascript:void(0);" class="badge badge-lg bg-success text-white">T</a>
                                        <a href="javascript:void(0);" class="badge badge-lg bg-danger text-white">F</a>
                                        <a href="javascript:void(0);"
                                            class="badge badge-lg bg-white border text-default">S</a>
                                        <a href="javascript:void(0);"
                                            class="badge badge-lg  bg-white border text-gray-1">S</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="col-xl-12 d-flex">
                    <div class="row flex-fill">
                        <div class="col-sm-6 col-xl-3 d-flex">
                            <a href="student-fees.html"
                                class="card border-0 border-bottom border-primary border-2 flex-fill animate-card">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <span class="avatar avatar-md rounded bg-primary me-2"><i
                                                class="ti ti-report-money fs-16"></i></span>
                                        <h6>Ví SV</h6>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-sm-6 col-xl-3 d-flex">
                            <a href="student-result.html"
                                class="card border-0 border-bottom border-success flex-fill animate-card">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <span class="avatar avatar-md rounded bg-success me-2"><i
                                                class="ti ti-hexagonal-prism-plus fs-16"></i></span>
                                        <h6>Tài nguyên</h6>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-sm-6 col-xl-3 d-flex">
                            <a href="student-time-table.html"
                                class="card border-0 border-bottom border-warning flex-fill animate-card">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <span class="avatar avatar-md rounded bg-warning me-2"><i
                                                class="ti ti-calendar fs-16"></i></span>
                                        <h6>Lịch học</h6>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-sm-6 col-xl-3 d-flex">
                            <a href="student-leaves.html"
                                class="card border-0 border-bottom border-dark border-2 flex-fill animate-card">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <span class="avatar avatar-md rounded bg-dark me-2"><i
                                                class="ti ti-calendar-share fs-16"></i></span>
                                        <h6>Điểm danh</h6>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="col-xxl-4 d-flex">
            <div class="card flex-fill">
                <div class="card-header d-flex align-items-center justify-content-between">
                    <h4 class="card-title">Lịch</h4>
                </div>
                <div class="card-body pb-0">
                    <div class="datepic mb-2"></div>
                    <h5 class="mb-3">Bài tập</h5>
                    <div class="p-3 pb-0 mb-3 border rounded">
                        <div class="d-flex align-items-center justify-content-between">
                            <h5 class="mb-3">1st Quarterly</h5>
                            <span class="badge badge-soft-danger d-inline-flex align-items-center mb-3"><i
                                    class="ti ti-clock me-1"></i>19 Days More</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="mb-3">
                                <h6 class="mb-1">Mathematics</h6>
                                <p><i class="ti ti-clock me-1"></i>01:30 - 02:15 PM</p>
                            </div>
                            <div class="mb-3 text-end">
                                <p class="mb-1"><i class="ti ti-calendar-bolt me-1"></i>06 May 2024</p>
                                <p class="text-primary">Room No : 15</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 pb-0 mb-3 border rounded">
                        <div class="d-flex align-items-center justify-content-between">
                            <h5 class="mb-3">2nd Quarterly</h5>
                            <span class="badge badge-soft-danger d-inline-flex align-items-center mb-3"><i
                                    class="ti ti-clock me-1"></i>20 Days More</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="mb-3">
                                <h6 class="mb-1">Physics</h6>
                                <p><i class="ti ti-clock me-1"></i>01:30 - 02:15 PM</p>
                            </div>
                            <div class="mb-3 text-end">
                                <p class="mb-1"><i class="ti ti-calendar-bolt me-1"></i>07 May 2024</p>
                                <p class="text-primary">Room No : 15</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    @endsection
