<<<<<<< HEAD
@extends('client.master')

@section('content')
<div class="breadcrumbs-area">
    {{-- <h3>Admin Dashboard</h3> --}}
    <ul>
        <li>
            <a href="index.html">Trang chủ</a>
        </li>
        <li>Thông báo</li>
    </ul>
</div>
    <div class="col-12-xxxl col-12">
        <div class="card dashboard-card-six">
            <div class="card-body">
                <div class="heading-layout1 mg-b-17">
                    <div class="item-title">
                        <h3>Thông báo</h3>
                    </div>
                    <div class="dropdown">
                        <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">...</a>
                    
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="#"><i class="fas fa-times text-orange-red"></i>Đóng</a>
                            <a class="dropdown-item" href="#"><i class="fas fa-cogs text-dark-pastel-green"></i>Chỉnh sửa</a>
                            <a class="dropdown-item" href="#"><i class="fas fa-redo-alt text-orange-peel"></i>Refresh</a>
                        </div>
                    </div>
                </div>
                <div class="notice-box-wrap">
                    <div class="notice-list">
                        <div class="post-date bg-skyblue">16 Tháng 6, 2019</div>
                        <h6 class="notice-title"><a href="#">Quản lý trường học tuyệt vời, hãy tham khảo các thông tin này.</a></h6>
                        <div class="entry-meta"> Bảo Vũ / <span>5 phút trước</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-yellow">16 Tháng 6, 2019</div>
                        <h6 class="notice-title"><a href="#">Quản lý trường học tuyệt vời trong việc in ấn.</a></h6>
                        <div class="entry-meta"> Bảo Vũ / <span>5 phút trước</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-pink">16 Tháng 6, 2019</div>
                        <h6 class="notice-title"><a href="#">Quản lý trường học tuyệt vời với một số thông tin quan trọng.</a></h6>
                        <div class="entry-meta"> Bảo Vũ / <span>5 phút trước</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-skyblue">16 Tháng 6, 2019</div>
                        <h6 class="notice-title"><a href="#">Quản lý trường học tuyệt vời về nội dung in ấn.</a></h6>
                        <div class="entry-meta"> Bảo Vũ / <span>5 phút trước</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-yellow">16 Tháng 6, 2019</div>
                        <h6 class="notice-title"><a href="#">Quản lý trường học tuyệt vời trong việc in ấn.</a></h6>
                        <div class="entry-meta"> Bảo Vũ / <span>5 phút trước</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-pink">16 Tháng 6, 2019</div>
                        <h6 class="notice-title"><a href="#">Quản lý trường học tuyệt vời trong các thông tin.</a></h6>
                        <div class="entry-meta"> Bảo Vũ / <span>5 phút trước</span></div>
=======
@extends('client.layouts.master')

@section('content')
<div class="card">
    <div class="card-header pb-1">
        <div class="d-flex align-items-center justify-content-between flex-wrap">
            <div class="mb-3">
                <h4>Notifications</h4>
            </div>
        </div>
    </div>
    <div class="card-body pb-1">
        <div class="d-block">
            <div
                class="d-flex align-items-center justify-content-between flex-wrap shadow-sm p-3 pb-0 noti-hover border rounded mb-3">
                <div class="d-flex align-items-start flex-fill">
                    <a href="#" class="avatar avatar-lg flex-shrink-0 me-2 mb-2">
                        <img alt="Lesley Grauer" src="assets/img/profiles/avatar-01.jpg"
                            class=" img-fluid">
                    </a>
                    <div class="mb-3">
                        <p class="mb-0 text-dark  fw-medium">Sylvia added appointment on 02:00 PM</p>
                        <span>4 mins ago</span>
                        <div class="d-flex align-items-center mt-1">
                            <a href="javascript:void(0);" class="btn btn-light btn-sm me-2">Decline</a>
                            <a href="javascript:void(0);" class="btn btn-primary btn-sm">Accept</a>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="d-flex align-items-center justify-content-between flex-wrap shadow-sm noti-hover border p-3 pb-0 rounded mb-3">
                <div class="d-flex align-items-start flex-fill">
                    <a href="#" class="avatar avatar-lg flex-shrink-0 me-2 mb-3">
                        <img alt="Lesley Grauer" src="assets/img/profiles/avatar-02.jpg"
                            class=" img-fluid">
                    </a>
                    <div class="mb-3">
                        <p class="mb-0 text-dark  fw-medium">Shawn performance in Math is below the
                            threshold.</p>
                        <span>6 mins ago</span>
                    </div>
                </div>
            </div>
            <div
                class="d-flex align-items-center justify-content-between flex-wrap shadow-sm noti-hover border p-3 pb-0 rounded mb-3">
                <div class="d-flex align-items-start flex-fill">
                    <a href="#" class="avatar avatar-lg flex-shrink-0 me-2 mb-3">
                        <img alt="Lesley Grauer" src="assets/img/profiles/avatar-04.jpg"
                            class=" img-fluid">
                    </a>
                    <div class="mb-3">
                        <p class="mb-0 text-dark  fw-medium">A new teacher record for John</p>
                        <span>09:45 am</span>
                    </div>
                </div>
            </div>
            <div
                class="d-flex align-items-center justify-content-between flex-wrap shadow-sm noti-hover border p-3 pb-0 rounded mb-3">
                <div class="d-flex align-items-start flex-fill">
                    <a href="#" class="avatar avatar-lg flex-shrink-0 me-2 mb-3">
                        <img alt="Lesley Grauer" src="assets/img/profiles/avatar-03.jpg"
                            class=" img-fluid">
                    </a>
                    <div class="mb-3">
                        <p class="mb-0 text-dark fw-medium">New student record George is created by
                            Teressa</p>
                        <span>2 hrs ago</span>
                    </div>
                </div>
            </div>
            <div
                class="d-flex align-items-center justify-content-between flex-wrap shadow-sm noti-hover border p-3 pb-0 rounded mb-3">
                <div class="d-flex align-items-start flex-fill">
                    <a href="#" class="avatar avatar-lg flex-shrink-0 me-2 mb-3">
                        <img alt="Lesley Grauer" src="assets/img/profiles/avatar-27.jpg"
                            class=" img-fluid">
                    </a>
                    <div class="mb-3">
                        <p class="mb-0 text-dark  fw-medium">New staff record is created</p>
                        <span>10 mins ago</span>
                    </div>
                </div>
            </div>
            <div
                class="d-flex align-items-center justify-content-between flex-wrap shadow-sm noti-hover border p-3 pb-0 rounded mb-3">
                <div class="d-flex align-items-start flex-fill">
                    <a href="#" class="avatar avatar-lg flex-shrink-0 me-2 mb-3">
                        <img alt="Lesley Grauer" src="assets/img/profiles/avatar-10.jpg"
                            class=" img-fluid">
                    </a>
                    <div class="mb-3">
                        <p class="mb-0 text-dark  fw-medium">Exam time table added</p>
                        <span>1 hr ago</span>
>>>>>>> khanh
                    </div>
                </div>
            </div>
        </div>
    </div>
<<<<<<< HEAD
@endsection
=======
</div>
@endsection

>>>>>>> khanh
