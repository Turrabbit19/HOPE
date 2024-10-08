@extends('client.master')
@section('content')
<div class="breadcrumbs-area">
    {{-- <h3>Admin Dashboard</h3> --}}
    <ul>
        <li>
            <a href="index.html">Home</a>
        </li>
        <li>Student</li>
    </ul>
</div>
    <div class="row">
        <div class="col-4-xxxl col-12">
            <div class="card dashboard-card-ten">
                <div class="card-body">
                    <div class="heading-layout1">
                        <div class="item-title">
                            <h3>About Me</h3>
                        </div>
    
                    </div>
                    <div class="student-info">
                        <div class="media media-none--xs">
                            <div class="item-img">
                                <img src="{{ asset('assets/img/figure/student.png') }}" class="media-img-auto" alt="student">
                            </div>
                            <div class="media-body">
                                <h3 class="item-title">Jessia Rose</h3>
                                <p>Aliquam erat volutpat. Curabiene natis massa
                                    sedde lacustiquen sodale word moun taiery.</p>
                            </div>
                        </div>
                        <div class="table-responsive info-table">
                            <table class="table text-nowrap">
                                <tbody>
                                    <tr>
                                        <td>Name:</td>
                                        <td class="font-medium text-dark-medium">Jessia Rose</td>
                                    </tr>
                                    <tr>
                                        <td>Gender:</td>
                                        <td class="font-medium text-dark-medium">Female</td>
                                    </tr>
                                    <tr>
                                        <td>Father Name:</td>
                                        <td class="font-medium text-dark-medium">Fahim Rahman</td>
                                    </tr>
                                    <tr>
                                        <td>Mother Name:</td>
                                        <td class="font-medium text-dark-medium">Jannatul Kazi</td>
                                    </tr>
                                    <tr>
                                        <td>Date Of Birth:</td>
                                        <td class="font-medium text-dark-medium">07.08.2006</td>
                                    </tr>
                                    <tr>
                                        <td>Religion:</td>
                                        <td class="font-medium text-dark-medium">Islam</td>
                                    </tr>
                                    <tr>
                                        <td>Father Occupation:</td>
                                        <td class="font-medium text-dark-medium">Graphic Designer</td>
                                    </tr>
                                    <tr>
                                        <td>E-Mail:</td>
                                        <td class="font-medium text-dark-medium">jessiarose@gmail.com</td>
                                    </tr>
                                    <tr>
                                        <td>Admission Date:</td>
                                        <td class="font-medium text-dark-medium">05.01.2019</td>
                                    </tr>
                                    <tr>
                                        <td>Class:</td>
                                        <td class="font-medium text-dark-medium">2</td>
                                    </tr>
    
                                    <tr>
                                        <td>Roll:</td>
                                        <td class="font-medium text-dark-medium">10005</td>
                                    </tr>
                                    <tr>
                                        <td>Adress:</td>
                                        <td class="font-medium text-dark-medium">House #10, Road #6,
                                            Australia</td>
                                    </tr>
                                    <tr>
                                        <td>Phone:</td>
                                        <td class="font-medium text-dark-medium">+ 88 9856418</td>
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
                                    <div class="item-title">Notification</div>
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
                                    <div class="item-title">Events</div>
                                    <div class="item-number"><span class="counter" data-num="06">06</span></div>
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
                                    <div class="item-title">Attendance</div>
                                    <div class="item-number"><span class="counter" data-num="94">94</span><span>%</span></div>
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
                                    <h3>All Exam Results</h3>
                                </div>
                            </div>
                            <div class="table-box-wrap">
                                <form class="search-form-box">
                                    <div class="row gutters-8">
                                        <div class="col-lg-4 col-12 form-group">
                                            <input type="text" placeholder="Search by Exam ..." class="form-control">
                                        </div>
                                        <div class="col-lg-3 col-12 form-group">
                                            <input type="text" placeholder="Search by Subject ..." class="form-control">
                                        </div>
                                        <div class="col-lg-3 col-12 form-group">
                                            <input type="text" placeholder="dd/mm/yyyy" class="form-control">
                                        </div>
                                        <div class="col-lg-2 col-12 form-group">
                                            <button type="submit" class="fw-btn-fill btn-gradient-yellow">SEARCH</button>
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
                                                <th>Exam Name</th>
                                                <th>Subject</th>
                                                <th>Grade</th>
                                                <th>Percent</th>
                                                <th>Date</th>
    
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
                                                <td>Class Test</td>
                                                <td>English</td>
                                                <td>A</td>
                                                <td>99.00 > 100</td>
                                                <td>22/02/2019</td>
    
    
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0022</label>
                                                    </div>
                                                </td>
                                                <td>Class Test</td>
                                                <td>English</td>
                                                <td>A</td>
                                                <td>99.00 > 100</td>
                                                <td>22/02/2019</td>
    
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0023</label>
                                                    </div>
                                                </td>
                                                <td>Class Test</td>
                                                <td>Chemistry</td>
                                                <td>A</td>
                                                <td>99.00 > 100</td>
                                                <td>22/02/2019</td>
    
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0024</label>
                                                    </div>
                                                </td>
                                                <td>Class Test</td>
                                                <td>English</td>
                                                <td>A</td>
                                                <td>99.00 > 100</td>
                                                <td>22/02/2019</td>
    
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0025</label>
                                                    </div>
                                                </td>
                                                <td>Class Test</td>
                                                <td>Chemistry</td>
                                                <td>A</td>
                                                <td>99.00 > 100</td>
                                                <td>22/02/2019</td>
    
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0025</label>
                                                    </div>
                                                </td>
                                                <td>Class Test</td>
                                                <td>Chemistry</td>
                                                <td>D</td>
                                                <td>70.00 > 100</td>
                                                <td>22/02/2019</td>
    
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0025</label>
                                                    </div>
                                                </td>
                                                <td>Class Test</td>
                                                <td>English</td>
                                                <td>C</td>
                                                <td>80.00 > 100</td>
                                                <td>22/02/2019</td>
    
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0025</label>
                                                    </div>
                                                </td>
                                                <td>Class Test</td>
                                                <td>English</td>
                                                <td>B</td>
                                                <td>99.00 > 100</td>
                                                <td>22/02/2019</td>
    
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input">
                                                        <label class="form-check-label">#0025</label>
                                                    </div>
                                                </td>
                                                <td>First Semister</td>
                                                <td>English</td>
                                                <td>A</td>
                                                <td>99.00 > 100</td>
                                                <td>22/02/2019</td>
    
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Exam Result Area End Here -->
            </div>
        </div>
    </div>
@endsection
