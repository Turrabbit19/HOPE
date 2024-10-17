@extends('client.layouts.master')

@section('content')
<div class="row">

    <div class="col-xxl-4 col-xl-5 theiaStickySidebar">
        <div class="card border-white">
            <div class="card-header">
                <div class="d-flex align-items-center flex-wrap row-gap-3">
                    <div
                        class="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-4 flex-shrink-0 text-dark frames">
                        <img src="assets/img/students/student-01.jpg" class="img-fluid" alt="img">
                    </div>
                    <div class="overflow-hidden">
                        <span class="badge badge-soft-success d-inline-flex align-items-center mb-1"><i
                                class="ti ti-circle-filled fs-5 me-1"></i>Active</span>
                        <h5 class="mb-1 text-truncate">Phạm Quốc Khanh</h5>
                        <p class="text-primary">PH38668</p>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <dl class="row mb-0">
                    <dt class="col-5 fw-medium text-dark mb-3">Ngày sinh</dt>
                    <dd class="col-7 mb-3">11/02/2004</dd>
                    <dt class="col-5 fw-medium text-dark mb-3">Giới tính</dt>
                    <dd class="col-7 mb-3">Nam</dd>
                    <dt class="col-5 fw-medium text-dark mb-3">Email</dt>
                    <dd class="col-7 mb-3">khanhpqph38668@fpt.edu.vn</dd>
                    <dt class="col-5 fw-medium text-dark mb-3">Số điện thoại</dt>
                    <dd class="col-7 mb-3">0334675867</dd>
                    <dt class="col-5 fw-medium text-dark mb-3">Địa chỉ</dt>
                    <dd class="col-7 mb-3">54 Mỹ Đình 2, Hà Nội</dd>
                    <dt class="col-5 fw-medium text-dark mb-3">Dân tộc</dt>
                    <dd class="col-7 mb-3">Kinh</dd>
                    <dt class="col-5 fw-medium text-dark mb-3">Trạng thái</dt>
                    <dd class="col-7 mb-3">Đang học</dd>
                </dl>
            </div>

        </div>
    </div>

    <div class="col-xxl-8 col-xl-7">
        <div class="row">
            <div class="col-md-12">

                <ul class="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                        <a href="student-details.html" class="nav-link active"><i
                                class="ti ti-school me-2"></i>Phụ huynh</a>
                    </li>
                    <li>
                        <a href="student-time-table.html" class="nav-link"><i
                                class="ti ti-table-options me-2"></i>Chỉnh sửa thông tin cá nhân</a>
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
                    </div>
                </div>

            </div>

        </div>
    </div>
</div>
@endsection