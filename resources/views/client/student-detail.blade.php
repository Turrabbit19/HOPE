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
                                data-cfemail="fc969d92bc99849d918c9099d29f9391">[email&#160;protected]</a>
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
                        <a href="student-details.html" class="nav-link active"><i
                                class="ti ti-school me-2"></i>Student Details</a>
                    </li>
                    <li>
                        <a href="student-time-table.html" class="nav-link"><i
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
                    <div class="card-header">
                        <h5>Parents Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="border rounded p-3 pb-0 mb-3">
                            <div class="row">
                                <div class="col-sm-6 col-lg-4">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="avatar avatar-lg flex-shrink-0">
                                            <img src="assets/img/parents/parent-13.jpg"
                                                class="img-fluid rounded" alt="img">
                                        </span>
                                        <div class="ms-2 overflow-hidden">
                                            <h6 class="text-truncate">Jerald Vicinius</h6>
                                            <p class="text-primary">Father</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-4">
                                    <div class="mb-3">
                                        <p class="text-dark fw-medium mb-1">Phone</p>
                                        <p>+1 45545 46464</p>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-4">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="mb-3 overflow-hidden me-3">
                                            <p class="text-dark fw-medium mb-1">Email</p>
                                            <p class="text-truncate"><a
                                                    href="https://preskool.dreamstechnologies.com/cdn-cgi/l/email-protection"
                                                    class="__cf_email__"
                                                    data-cfemail="a1cbc4d3c0e1c4d9c0ccd1cdc48fc2cecc">[email&#160;protected]</a>
                                            </p>
                                        </div>
                                        <a href="javascript:void(0);" data-bs-toggle="tooltip"
                                            data-bs-placement="top" aria-label="Print"
                                            data-bs-original-title="Reset Password"
                                            class="btn btn-dark btn-icon btn-sm mb-3"><i
                                                class="ti ti-lock-x"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="border rounded p-3 pb-0 mb-3">
                            <div class="row">
                                <div class="col-lg-4 col-sm-6 ">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="avatar avatar-lg flex-shrink-0">
                                            <img src="assets/img/parents/parent-14.jpg"
                                                class="img-fluid rounded" alt="img">
                                        </span>
                                        <div class="ms-2 overflow-hidden">
                                            <h6 class="text-truncate">Roberta Webber</h6>
                                            <p class="text-primary">Mother</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-sm-6 ">
                                    <div class="mb-3">
                                        <p class="text-dark fw-medium mb-1">Phone</p>
                                        <p>+1 46499 24357</p>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-sm-6">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="mb-3 overflow-hidden me-3">
                                            <p class="text-dark fw-medium mb-1">Email</p>
                                            <p class="text-truncate"><a
                                                    href="https://preskool.dreamstechnologies.com/cdn-cgi/l/email-protection"
                                                    class="__cf_email__"
                                                    data-cfemail="5b2934393e1b3e233a362b373e75383436">[email&#160;protected]</a>
                                            </p>
                                        </div>
                                        <a href="javascript:void(0);" data-bs-toggle="tooltip"
                                            data-bs-placement="top" aria-label="Print"
                                            data-bs-original-title="Reset Password"
                                            class="btn btn-dark btn-icon btn-sm mb-3"><i
                                                class="ti ti-lock-x"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="border rounded p-3 pb-0">
                            <div class="row">
                                <div class="col-lg-4 col-sm-6">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="avatar avatar-lg flex-shrink-0">
                                            <img src="assets/img/parents/parent-13.jpg"
                                                class="img-fluid rounded" alt="img">
                                        </span>
                                        <div class="ms-2 overflow-hidden">
                                            <h6 class="text-truncate">Jerald Vicinius</h6>
                                            <p class="text-primary">Gaurdian (Father)</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-sm-6">
                                    <div class="mb-3">
                                        <p class="text-dark fw-medium mb-1">Phone</p>
                                        <p>+1 45545 46464</p>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-sm-6">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="mb-3 overflow-hidden me-3">
                                            <p class="text-dark fw-medium mb-1">Email</p>
                                            <p class="text-truncate"><a
                                                    href="https://preskool.dreamstechnologies.com/cdn-cgi/l/email-protection"
                                                    class="__cf_email__"
                                                    data-cfemail="91fbf4e3f0d1f4e9f0fce1fdf4bff2fefc">[email&#160;protected]</a>
                                            </p>
                                        </div>
                                        <a href="javascript:void(0);" data-bs-toggle="tooltip"
                                            data-bs-placement="top" aria-label="Print"
                                            data-bs-original-title="Reset Password"
                                            class="btn btn-dark btn-icon btn-sm mb-3"><i
                                                class="ti ti-lock-x"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="col-xxl-6 d-flex">
                <div class="card flex-fill">
                    <div class="card-header">
                        <h5>Documents</h5>
                    </div>
                    <div class="card-body">
                        <div
                            class="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2">
                            <div class="d-flex align-items-center overflow-hidden">
                                <span
                                    class="avatar avatar-md bg-white rounded flex-shrink-0 text-default"><i
                                        class="ti ti-pdf fs-15"></i></span>
                                <div class="ms-2">
                                    <p class="text-truncate fw-medium text-dark">BirthCertificate.pdf
                                    </p>
                                </div>
                            </div>
                            <a href="#" class="btn btn-dark btn-icon btn-sm"><i
                                    class="ti ti-download"></i></a>
                        </div>
                        <div
                            class="bg-light-300 border rounded d-flex align-items-center justify-content-between p-2">
                            <div class="d-flex align-items-center overflow-hidden">
                                <span
                                    class="avatar avatar-md bg-white rounded flex-shrink-0 text-default"><i
                                        class="ti ti-pdf fs-15"></i></span>
                                <div class="ms-2">
                                    <p class="text-truncate fw-medium text-dark">Transfer
                                        Certificate.pdf</p>
                                </div>
                            </div>
                            <a href="#" class="btn btn-dark btn-icon btn-sm"><i
                                    class="ti ti-download"></i></a>
                        </div>
                    </div>
                </div>
            </div>


            <div class="col-xxl-6 d-flex">
                <div class="card flex-fill">
                    <div class="card-header">
                        <h5>Address</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <span
                                class="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default"><i
                                    class="ti ti-map-pin-up"></i></span>
                            <div>
                                <p class="text-dark fw-medium mb-1">Current Address</p>
                                <p>3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <span
                                class="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default"><i
                                    class="ti ti-map-pins"></i></span>
                            <div>
                                <p class="text-dark fw-medium mb-1">Permanent Address</p>
                                <p>3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="col-xxl-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Previous School Details</h5>
                    </div>
                    <div class="card-body pb-1">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <p class="text-dark fw-medium mb-1">Previous School Name</p>
                                    <p>Oxford Matriculation, USA</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <p class="text-dark fw-medium mb-1">School Address</p>
                                    <p>1852 Barnes Avenue, Cincinnati, OH 45202</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="col-xxl-6 d-flex">
                <div class="card flex-fill">
                    <div class="card-header">
                        <h5>Bank Details</h5>
                    </div>
                    <div class="card-body pb-1">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <p class="text-dark fw-medium mb-1">Bank Name</p>
                                    <p>Bank of America</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <p class="text-dark fw-medium mb-1">Branch</p>
                                    <p>Cincinnati</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <p class="text-dark fw-medium mb-1">IFSC</p>
                                    <p>BOA83209832</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="col-xxl-6 d-flex">
                <div class="card flex-fill">
                    <div class="card-header">
                        <h5>Medical History</h5>
                    </div>
                    <div class="card-body pb-1">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <p class="text-dark fw-medium mb-1">Known Allergies</p>
                                    <span class="badge bg-light text-dark">Rashes</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <p class="text-dark fw-medium mb-1">Medications</p>
                                    <p>-</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="col-xxl-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Other Info</h5>
                    </div>
                    <div class="card-body">
                        <p>Depending on the specific needs of your organization or system, additional
                            information may be collected or tracked. It's important to ensure that any
                            data collected complies with privacy regulations and policies to protect
                            students' sensitive information.</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection