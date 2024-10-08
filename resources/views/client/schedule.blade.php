@extends('client.layouts.master')

@section('content')
<div class="row">

    <div class="col-md-12">
        <div class="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div class="my-auto mb-2">
                <h3 class="page-title mb-1">Student Details</h3>
                <nav>
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <a href="index.html">Dashboard</a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="students.html">Student</a>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">Student Details</li>
                    </ol>
                </nav>
            </div>
            <div class="d-flex my-xl-auto right-content align-items-center  flex-wrap">
                <a href="#" class="btn btn-light me-2 mb-2" data-bs-toggle="modal"
                    data-bs-target="#login_detail"><i class="ti ti-lock me-2"></i>Login Details</a>
                <a href="edit-student.html" class="btn btn-primary d-flex align-items-center mb-2"><i
                        class="ti ti-edit-circle me-2"></i>Edit Student</a>
            </div>
        </div>
    </div>

</div>
<div class="row">

    <div class="col-xxl-3 col-xl-4 theiaStickySidebar">
        <div class="card border-white">
            <div class="card-header">
                <div class="d-flex align-items-center flex-wrap row-gap-3">
                    <div
                        class="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                        <img src="assets/img/students/student-01.jpg" class="img-fluid" alt="img">
                    </div>
                    <div class="overflow-hidden">
                        <span class="badge badge-soft-success d-inline-flex align-items-center mb-1"><i
                                class="ti ti-circle-filled fs-5 me-1"></i>Active</span>
                        <h5 class="mb-1 text-truncate">Janet Daniel</h5>
                        <p class="text-primary">AD1256589</p>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <h5 class="mb-3">Basic Information</h5>
                <dl class="row mb-0">
                    <dt class="col-6 fw-medium text-dark mb-3">Roll No</dt>
                    <dd class="col-6 mb-3">35013</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Gender</dt>
                    <dd class="col-6 mb-3">Female</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Date Of Birth</dt>
                    <dd class="col-6 mb-3">25 Jan 2008</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Blood Group</dt>
                    <dd class="col-6 mb-3">O +ve</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Blood Group</dt>
                    <dd class="col-6 mb-3">Red</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Reigion</dt>
                    <dd class="col-6 mb-3">Christianity</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Caste</dt>
                    <dd class="col-6 mb-3">Catholic</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Category</dt>
                    <dd class="col-6 mb-3">OBC</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Mother tongue</dt>
                    <dd class="col-6 mb-3">English</dd>
                    <dt class="col-6 fw-medium text-dark mb-3">Language</dt>
                    <dd class="col-6 mb-3"><span
                            class="badge badge-light text-dark me-2">English</span><span
                            class="badge badge-light text-dark">Spanish</span></dd>
                </dl>
                <a href="#" data-bs-toggle="modal" data-bs-target="#add_fees_collect"
                    class="btn btn-primary btn-sm w-100">Add Fees</a>
            </div>

        </div>

        <div class="card border-white">
            <div class="card-body">
                <h5 class="mb-3">Primary Contact Info</h5>
                <div class="d-flex align-items-center mb-3">
                    <span
                        class="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default"><i
                            class="ti ti-phone"></i></span>
                    <div>
                        <span class="text-dark fw-medium mb-1">Phone Number</span>
                        <p>+1 46548 84498</p>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span
                        class="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default"><i
                            class="ti ti-mail"></i></span>
                    <div>
                        <span class="text-dark fw-medium mb-1">Email Address</span>
                        <p><a href="https://preskool.dreamstechnologies.com/cdn-cgi/l/email-protection"
                                class="__cf_email__"
                                data-cfemail="94fef5fad4f1ecf5f9e4f8f1baf7fbf9">[email&#160;protected]</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div class="card border-white">
            <div class="card-body">
                <h5 class="mb-3">Sibiling Information</h5>
                <div class="d-flex align-items-center bg-light-300 rounded p-3 mb-3">
                    <span class="avatar avatar-lg">
                        <img src="assets/img/students/student-06.jpg" class="img-fluid rounded"
                            alt="img">
                    </span>
                    <div class="ms-2">
                        <h5 class="fs-14">Ralph Claudia</h5>
                        <p>III, B</p>
                    </div>
                </div>
                <div class="d-flex align-items-center bg-light-300 rounded p-3">
                    <span class="avatar avatar-lg">
                        <img src="assets/img/students/student-07.jpg" class="img-fluid rounded"
                            alt="img">
                    </span>
                    <div class="ms-2">
                        <h5 class="fs-14">Julie Scott</h5>
                        <p>V, A</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="card border-white">
            <div class="card-body pb-1">
                <ul class="nav nav-tabs nav-tabs-bottom mb-3">
                    <li class="nav-item"><a class="nav-link active" href="#hostel"
                            data-bs-toggle="tab">Hostel</a></li>
                    <li class="nav-item"><a class="nav-link" href="#transport"
                            data-bs-toggle="tab">Transportation</a></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="hostel">
                        <div class="d-flex align-items-center mb-3">
                            <span
                                class="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default"><i
                                    class="ti ti-building-fortress fs-16"></i></span>
                            <div>
                                <h6 class="fs-14 mb-1">HI-Hostel, Floor</h6>
                                <p class="text-primary">Room No : 25</p>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="transport">
                        <div class="d-flex align-items-center mb-3">
                            <span
                                class="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default"><i
                                    class="ti ti-bus fs-16"></i></span>
                            <div>
                                <span class="fs-12 mb-1">Route</span>
                                <p class="text-dark">Newyork</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="mb-3">
                                    <span class="fs-12 mb-1">Bus Number</span>
                                    <p class="text-dark">AM 54548</p>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="mb-3">
                                    <span class="fs-12 mb-1">Pickup Point</span>
                                    <p class="text-dark">Cincinatti</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="col-xxl-9 col-xl-8">
        <div class="row">
            <div class="col-md-12">

                <ul class="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                        <a href="student-details.html" class="nav-link"><i
                                class="ti ti-school me-2"></i>Student Details</a>
                    </li>
                    <li>
                        <a href="student-time-table.html" class="nav-link active"><i
                                class="ti ti-table-options me-2"></i>Time Table</a>
                    </li>
                    <li>
                        <a href="student-leaves.html" class="nav-link"><i
                                class="ti ti-calendar-due me-2"></i>Leave & Attendance</a>
                    </li>
                    <li>
                        <a href="student-fees.html" class="nav-link"><i
                                class="ti ti-report-money me-2"></i>Fees</a>
                    </li>
                    <li>
                        <a href="student-result.html" class="nav-link"><i
                                class="ti ti-bookmark-edit me-2"></i>Exam & Results</a>
                    </li>
                    <li>
                        <a href="student-library.html" class="nav-link"><i
                                class="ti ti-books me-2"></i>Library</a>
                    </li>
                </ul>

                <div class="card">
                    <div
                        class="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                        <h4 class="mb-3">Exams & Results</h4>
                        <div class="d-flex align-items-center flex-wrap">
                            <div class="dropdown mb-3">
                                <a href="javascript:void(0);"
                                    class="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                                    data-bs-toggle="dropdown"><i
                                        class="ti ti-calendar-due me-2"></i>This Year</a>
                                <ul class="dropdown-menu p-3">
                                    <li>
                                        <a href="javascript:void(0);" class="dropdown-item rounded-1">
                                            This Year
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" class="dropdown-item rounded-1">
                                            This Month
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" class="dropdown-item rounded-1">
                                            This Week
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pb-0">
                        <div class="d-flex flex-nowrap overflow-auto">
                            <div class="d-flex flex-column me-4 flex-fill">
                                <div class="mb-3">
                                    <h6>Monday</h6>
                                </div>
                                <div class="bg-transparent-danger rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:00 - 09:45 AM</p>
                                    <p class="text-dark">Subject : Maths</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-07.jpg"
                                                    alt="Img"></span>
                                            Jacquelin
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-primary rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:45 - 10:30 AM</p>
                                    <p class="text-dark">Subject : English</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Hellana
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-success rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>10:45 - 11:30 AM</p>
                                    <p class="text-dark">Subject : Computer</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-02.jpg"
                                                    alt="Img"></span>
                                            Daniel
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-pending rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>11:30 - 12:15 PM</p>
                                    <p class="text-dark">Subject : Spanish</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Erickson
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-info rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>01:30 - 02:15 PM</p>
                                    <p class="text-dark">Subject : Science</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-05.jpg"
                                                    alt="Img"></span>
                                            Morgan
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-light rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>02:15 - 03:00 PM</p>
                                    <p class="text-dark">Subject : Chemistry</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-06.jpg"
                                                    alt="Img"></span>
                                            Aaron
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-warning rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>03:15 - 04:00 PM</p>
                                    <p class="text-dark">Subject : Physics</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-01.jpg"
                                                    alt="Img"></span>
                                            Teresa
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column me-4 flex-fill">
                                <div class="mb-3">
                                    <h6>Tuesday</h6>
                                </div>
                                <div class="bg-transparent-pending rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:00 - 09:45 AM</p>
                                    <p class="text-dark">Subject : Spanish</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Erickson
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-warning rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:45 - 10:30 AM</p>
                                    <p class="text-dark">Subject : Physics</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-01.jpg"
                                                    alt="Img"></span>
                                            Teresa
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-light rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>10:45 - 11:30 AM</p>
                                    <p class="text-dark">Subject : Chemistry</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-06.jpg"
                                                    alt="Img"></span>
                                            Aaron
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-danger rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>11:30 - 12:15 PM</p>
                                    <p class="text-dark">Subject : Maths</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-07.jpg"
                                                    alt="Img"></span>
                                            Jacquelin
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-success rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>01:30 - 02:15 PM</p>
                                    <p class="text-dark">Subject : Computer</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-02.jpg"
                                                    alt="Img"></span>
                                            Daniel
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-primary rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>02:15 - 03:00 PM</p>
                                    <p class="text-dark">Subject : English</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Hellana
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-info rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>03:15 - 04:00 PM</p>
                                    <p class="text-dark">Subject : Science</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-05.jpg"
                                                    alt="Img"></span>
                                            Morgan
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column me-4 flex-fill">
                                <div class="mb-3">
                                    <h6>Wednesday</h6>
                                </div>
                                <div class="bg-transparent-success rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:00 - 09:45 AM</p>
                                    <p class="text-dark">Subject : Computer</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-02.jpg"
                                                    alt="Img"></span>
                                            Daniel
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-info rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:45 - 10:30 AM</p>
                                    <p class="text-dark">Subject : Science</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-05.jpg"
                                                    alt="Img"></span>
                                            Morgan
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-danger rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>10:45 - 11:30 AM</p>
                                    <p class="text-dark">Subject : Maths</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-07.jpg"
                                                    alt="Img"></span>
                                            Jacquelin
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-light rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>11:30 - 12:15 PM</p>
                                    <p class="text-dark">Subject : Chemistry</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-06.jpg"
                                                    alt="Img"></span>
                                            Aaron
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-warning rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>01:30 - 02:15 PM</p>
                                    <p class="text-dark">Subject : Physics</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-01.jpg"
                                                    alt="Img"></span>
                                            Teresa
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-primary rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>02:15 - 03:00 PM</p>
                                    <p class="text-dark">Subject : English</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Hellana
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-pending rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>03:15 - 04:00 PM</p>
                                    <p class="text-dark">Subject : Spanish</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Erickson
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column me-4 flex-fill">
                                <div class="mb-3">
                                    <h6>Thursday</h6>
                                </div>
                                <div class="bg-transparent-warning rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:00 - 09:45 AM</p>
                                    <p class="text-dark">Subject : Physics</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-01.jpg"
                                                    alt="Img"></span>
                                            Teresa
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-success rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:45 - 10:30 AM</p>
                                    <p class="text-dark">Subject : Computer</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-02.jpg"
                                                    alt="Img"></span>
                                            Daniel
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-primary rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>10:45 - 11:30 AM</p>
                                    <p class="text-dark">Subject : English</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Hellana
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-info rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>11:30 - 12:15 PM</p>
                                    <p class="text-dark">Subject : Science</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-05.jpg"
                                                    alt="Img"></span>
                                            Morgan
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-pending rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>01:30 - 02:15 PM</p>
                                    <p class="text-dark">Subject : Spanish</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Erickson
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-light rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>02:15 - 03:00 PM</p>
                                    <p class="text-dark">Subject : Chemistry</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-06.jpg"
                                                    alt="Img"></span>
                                            Aaron
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-danger rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>03:15 - 04:00 PM</p>
                                    <p class="text-dark">Subject : Maths</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-07.jpg"
                                                    alt="Img"></span>
                                            Jacquelin
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column me-4 flex-fill">
                                <div class="mb-3">
                                    <h6>Friday</h6>
                                </div>
                                <div class="bg-transparent-primary rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:00 - 09:45 AM</p>
                                    <p class="text-dark">Subject : English</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Hellana
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-pending rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:45 - 10:30 AM</p>
                                    <p class="text-dark">Subject : Spanish</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Erickson
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-warning rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>10:45 - 11:30 AM</p>
                                    <p class="text-dark">Subject : Physics</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-01.jpg"
                                                    alt="Img"></span>
                                            Teresa
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-light rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>11:30 - 12:15 PM</p>
                                    <p class="text-dark">Subject : Chemistry</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-06.jpg"
                                                    alt="Img"></span>
                                            Aaron
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-danger rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>01:30 - 02:15 PM</p>
                                    <p class="text-dark">Subject : Maths</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-07.jpg"
                                                    alt="Img"></span>
                                            Jacquelin
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-success rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>02:15 - 3:00 PM</p>
                                    <p class="text-dark">Subject : Computer</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-02.jpg"
                                                    alt="Img"></span>
                                            Daniel
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-info rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>03:15 - 04:00 PM</p>
                                    <p class="text-dark">Subject : Science</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-05.jpg"
                                                    alt="Img"></span>
                                            Morgan
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column flex-fill">
                                <div class="mb-3">
                                    <h6>Saturday</h6>
                                </div>
                                <div class="bg-transparent-primary rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:00 - 09:45 AM</p>
                                    <p class="text-dark">Subject : English</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Hellana
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-pending rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>09:45 - 10:30 AM</p>
                                    <p class="text-dark">Subject : Spanish</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-03.jpg"
                                                    alt="Img"></span>
                                            Erickson
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-warning rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>10:45 - 11:30 AM</p>
                                    <p class="text-dark">Subject : Physics</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-01.jpg"
                                                    alt="Img"></span>
                                            Teresa
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-light rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>11:30 - 12:15 PM</p>
                                    <p class="text-dark">Subject : Chemistry</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-06.jpg"
                                                    alt="Img"></span>
                                            Aaron
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-danger rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>01:30 - 02:15 PM</p>
                                    <p class="text-dark">Subject : Maths</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-07.jpg"
                                                    alt="Img"></span>
                                            Jacquelin
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-success rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>02:15 - 3:00 PM</p>
                                    <p class="text-dark">Subject : Computer</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-02.jpg"
                                                    alt="Img"></span>
                                            Daniel
                                        </a>
                                    </div>
                                </div>
                                <div class="bg-transparent-info rounded p-3 mb-4">
                                    <p class="d-flex align-items-center text-nowrap mb-1"><i
                                            class="ti ti-clock me-1"></i>03:15 - 04:00 PM</p>
                                    <p class="text-dark">Subject : Science</p>
                                    <div class="bg-white rounded p-1 mt-3">
                                        <a href="teacher-details.html"
                                            class="text-muted d-flex align-items-center">
                                            <span class="avatar avatar-sm me-2"><img
                                                    src="assets/img/teachers/teacher-05.jpg"
                                                    alt="Img"></span>
                                            Morgan
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer border-0 pb-0">
                        <div class="row">
                            <div class="col-lg-4 col-xxl-4 col-xl-4 d-flex">
                                <div class="card flex-fill">
                                    <div class="card-body">
                                        <span class="bg-primary badge badge-sm mb-2">Morning
                                            Break</span>
                                        <p class="text-dark"><i class="ti ti-clock me-1"></i>10:30 to 10
                                            :45 AM</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-xxl-3 d-flex">
                                <div class="card flex-fill">
                                    <div class="card-body">
                                        <span class="bg-warning badge badge-sm mb-2">Lunch</span>
                                        <p class="text-dark"><i class="ti ti-clock me-1"></i>10:30 to 10
                                            :45 AM</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-xxl-3 d-flex">
                                <div class="card flex-fill">
                                    <div class="card-body">
                                        <span class="bg-info badge badge-sm mb-2">Evening Break</span>
                                        <p class="text-dark"><i class="ti ti-clock me-1"></i>03:30 PM to
                                            03:45 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="login_detail">
    <div class="modal-dialog modal-dialog-centered  modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Login Details</h4>
                <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal"
                    aria-label="Close">
                    <i class="ti ti-x"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="student-detail-info">
                    <span class="student-img"><img src="assets/img/students/student-01.jpg" alt="Img"></span>
                    <div class="name-info">
                        <h6>Janet <span>III, A</span></h6>
                    </div>
                </div>
                <div class="table-responsive custom-table no-datatable_length">
                    <table class="table datanew">
                        <thead class="thead-light">
                            <tr>
                                <th>User Type</th>
                                <th>User Name</th>
                                <th>Password </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Parent</td>
                                <td>parent53</td>
                                <td>parent@53</td>
                            </tr>
                            <tr>
                                <td>Student</td>
                                <td>student20</td>
                                <td>stdt@53</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</a>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="add_fees_collect">
    <div class="modal-dialog modal-dialog-centered  modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <div class="d-flex align-items-center">
                    <h4 class="modal-title">Collect Fees</h4>
                    <span class="badge badge-sm bg-primary ms-2">AD124556</span>
                </div>
                <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal"
                    aria-label="Close">
                    <i class="ti ti-x"></i>
                </button>
            </div>
            <form action="https://preskool.dreamstechnologies.com/html/template/collect-fees.html">
                <div class="modal-body">
                    <div class="bg-light-300 p-3 pb-0 rounded mb-4">
                        <div class="row align-items-center">
                            <div class="col-lg-3 col-md-6">
                                <div class="d-flex align-items-center mb-3">
                                    <a href="student-details.html" class="avatar avatar-md me-2">
                                        <img src="assets/img/students/student-01.jpg" alt="img">
                                    </a>
                                    <a href="student-details.html" class="d-flex flex-column"><span
                                            class="text-dark">Janet</span>III, A</a>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6">
                                <div class="mb-3">
                                    <span class="fs-12 mb-1">Total Outstanding</span>
                                    <p class="text-dark">2000</p>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6">
                                <div class="mb-3">
                                    <span class="fs-12 mb-1">Last Date</span>
                                    <p class="text-dark">25 May 2024</p>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6">
                                <div class="mb-3">
                                    <span class="badge badge-soft-danger"><i
                                            class="ti ti-circle-filled me-2"></i>Unpaid</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Fees Group</label>
                                <select class="select">
                                    <option>Select</option>
                                    <option>Class 1 General</option>
                                    <option>Monthly Fees</option>
                                    <option>Admission-Fees</option>
                                    <option>Class 1- I Installment</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Fees Type</label>
                                <select class="select">
                                    <option>Select</option>
                                    <option>Tuition Fees</option>
                                    <option>Monthly Fees</option>
                                    <option>Admission Fees</option>
                                    <option>Bus Fees</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Amount</label>
                                <input type="text" class="form-control" placeholder="Enter Amout">
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Collection Date</label>
                                <div class="date-pic">
                                    <input type="text" class="form-control datetimepicker" placeholder="Select">
                                    <span class="cal-icon"><i class="ti ti-calendar"></i></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Payment Type</label>
                                <select class="select">
                                    <option>Select</option>
                                    <option>Paytm</option>
                                    <option>Cash On Delivery</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Payment Reference No</label>
                                <input type="text" class="form-control"
                                    placeholder="Enter Payment Reference No">
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div
                                class="modal-satus-toggle d-flex align-items-center justify-content-between mb-3">
                                <div class="status-title">
                                    <h5>Status</h5>
                                    <p>Change the Status by toggle </p>
                                </div>
                                <div class="status-toggle modal-status">
                                    <input type="checkbox" id="user1" class="check">
                                    <label for="user1" class="checktoggle"> </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-0">
                                <label class="form-label">Notes</label>
                                <textarea rows="4" class="form-control" placeholder="Add Notes"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</a>
                    <button type="submit" class="btn btn-primary">Pay Fees</button>
                </div>
            </form>
        </div>
    </div>
</div>

</div>


<script data-cfasync="false" src="{{ asset('assets/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js') }}"></script>
@endsection


