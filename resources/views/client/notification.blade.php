@extends('client.master')

@section('content')
<div class="breadcrumbs-area">
    {{-- <h3>Admin Dashboard</h3> --}}
    <ul>
        <li>
            <a href="index.html">Trang ch</a>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
