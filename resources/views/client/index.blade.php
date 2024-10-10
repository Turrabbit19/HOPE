@extends('client.master')
@section('content')
    <div class="breadcrumbs-area">
        {{-- <h3>Admin Dashboard</h3> --}}
        <ul>
            <li>
                <a href="index.html">Trang chủ</a>
            </li>
            <li>Thông tin cá nhân</li>
        </ul>
    </div>
    <div class="row">
        <div class="col-4-xxxl col-12">
            <div class="card dashboard-card-ten">
                <div class="card-body">
                    <div class="heading-layout1">
                        <div class="item-title">
                            <h3>thông tin</h3>
                        </div>

                    </div>
                    <div class="student-info">
                        <div class="media media-none--xs">
                            <div class="item-img">
                                <img src="{{ asset('assets/img/figure/student.png') }}" class="media-img-auto"
                                    alt="student">
                            </div>
                            <div class="media-body">
                                <h3 class="item-title">Vũ Văn Bảo</h3>
                               
                            </div>
                        </div>
                        <div class="table-responsive info-table">
                            <table class="table text-nowrap">
                                <tbody>
                                    {{-- <tr>
                                        <td>Họ Tên:</td>
                                        <td class="font-medium text-dark-medium">Vũ Văn Bảo</td>
                                    </tr> --}}
                                    <tr>
                                        <td>Chuyên ngành:</td>
                                        <td class="font-medium text-dark-medium">Lập trình Website</td>
                                    </tr>
                                    <tr>
                                        <td>GPA:</td>
                                        <td class="font-medium text-dark-medium">8.3</td>
                                    </tr>
                                    <tr>
                                        <td>Giới tính:</td>
                                        <td class="font-medium text-dark-medium">Nam</td>
                                    </tr>
                                    <tr>
                                        <td>Ngày Sinh:</td>
                                        <td class="font-medium text-dark-medium">14.10.2004</td>
                                    </tr>
                                    <tr>
                                        <td>Email:</td>
                                        <td class="font-medium text-dark-medium">baovvph36087@fpt.edu.vn</td>
                                    </tr>
                                    <tr>
                                        <td>Ngày Nhập Học:</td>
                                        <td class="font-medium text-dark-medium">20.08.2022</td>
                                    </tr>
                                    <tr>
                                        <td>Lớp:</td>
                                        <td class="font-medium text-dark-medium">PRO224.Thuyvt66</td>
                                    </tr>
                                    <tr>
                                        <td>Địa Chỉ:</td>
                                        <td class="font-medium text-dark-medium">Mễ Trì, Hà Nội</td>
                                    </tr>
                                    <tr>
                                        <td>Điện Thoại:</td>
                                        <td class="font-medium text-dark-medium">037.647.3406</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-8-xxxl col-12">
            <div class="row">
                <!-- Summery Area Start Here -->
                <div class="col-lg-4">
                    <div class="dashboard-summery-one">
                        <div class="row">
                            <div class="col-6">
                                <div class="item-icon bg-light-magenta">
                                    <i class="flaticon-shopping-list text-magenta"></i>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="item-content">
                                    <div class="item-title">Thông báo</div>
                                    <div class="item-number"><span class="counter" data-num="12">12</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="dashboard-summery-one">
                        <div class="row">
                            <div class="col-6">
                                <div class="item-icon bg-light-blue">
                                    <i class="flaticon-calendar text-blue"></i>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="item-content">
                                    <div class="item-title">Môn học</div>
                                    <div class="item-number"><span class="counter" data-num="04">04</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="dashboard-summery-one">
                        <div class="row">
                            <div class="col-6">
                                <div class="item-icon bg-light-yellow">
                                    <i class="flaticon-percentage-discount text-orange"></i>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="item-content">
                                    <div class="item-title">Có mặt</div>
                                    <div class="item-number"><span class="counter" data-num="94">94</span><span>%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Summery Area End Here -->
                <!-- Exam Result Area Start Here -->
                <div class="col-lg-12">
                    <div class="card dashboard-card-eleven">
                        <div class="card-body">
                            <div class="heading-layout1">
                                <div class="item-title">
                                    <h3>Kết Quả Thi</h3>
                                </div>
                            </div>
                            <div class="table-box-wrap">
                                <form class="search-form-box">
                                    <div class="row gutters-8">

                                        <div class="col-lg-3 col-12 form-group">
                                            <input type="text" placeholder="Tìm kiếm theo Môn Học ..."
                                                class="form-control">
                                        </div>
                                        <div class="col-lg-3 col-12 form-group">
                                            <input type="text" placeholder="dd/mm/yyyy" class="form-control">
                                        </div>
                                        <div class="col-lg-2 col-12 form-group">
                                            <button type="submit" class="fw-btn-fill btn-gradient-yellow">TÌM KIẾM</button>
                                        </div>
                                    </div>
                                </form>
                                <div class="table-responsive result-table-box">
                                    <table class="table display data-table text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input checkAll">
                                                        <label class="form-check-label">ID</label>
                                                    </div>
                                                </th>

                                                <th>Môn Học</th>
                                                <th>Điểm</th>
                                                <th>Xếp Hạng</th>
                                                <th>Ngày</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0021</label>
                                                    </div>
                                                </td>

                                                <td>Pháp luật</td>
                                                <td>10</td>
                                                <td>01/40</td>
                                                <td>22/02/2019</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0022</label>
                                                    </div>
                                                </td>

                                                <td>Nhập môn lập trình</td>
                                                <td>10</td>
                                                <td>01/40</td>
                                                <td>14/09/2023</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0023</label>
                                                    </div>
                                                </td>

                                                <td>Chính trị</td>
                                                <td>9.8</td>
                                                <td>02/40</td>
                                                <td>22/12/2023</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0024</label>
                                                    </div>
                                                </td>

                                                <td>Lập trình PHP 3</td>
                                                <td>8.5</td>
                                                <td>12/40</td>
                                                <td>25/06/2024</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0025</label>
                                                    </div>
                                                </td>

                                                <td>Lập trình PHP 2</td>
                                                <td>8.8</td>
                                                <td>10/40</td>
                                                <td>10/11/2023</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
