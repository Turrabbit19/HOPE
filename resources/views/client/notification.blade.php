@extends('client.master')

@section('content')
<div class="breadcrumbs-area">
    {{-- <h3>Admin Dashboard</h3> --}}
    <ul>
        <li>
            <a href="index.html">Home</a>
        </li>
        <li>Notifications</li>
    </ul>
</div>
    <div class="col-12-xxxl col-12">
        <div class="card dashboard-card-six">
            <div class="card-body">
                <div class="heading-layout1 mg-b-17">
                    <div class="item-title">
                        <h3>Notifications</h3>
                    </div>
                    <div class="dropdown">
                        <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown"
                            aria-expanded="false">...</a>

                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="#"><i class="fas fa-times text-orange-red"></i>Close</a>
                            <a class="dropdown-item" href="#"><i
                                    class="fas fa-cogs text-dark-pastel-green"></i>Edit</a>
                            <a class="dropdown-item" href="#"><i
                                    class="fas fa-redo-alt text-orange-peel"></i>Refresh</a>
                        </div>
                    </div>
                </div>
                <div class="notice-box-wrap">
                    <div class="notice-list">
                        <div class="post-date bg-skyblue">16 June, 2019</div>
                        <h6 class="notice-title"><a href="#">Great School manag mene esom tus eleifend
                                lectus
                                sed maximus mi faucibusnting.</a></h6>
                        <div class="entry-meta"> Jennyfar Lopez / <span>5 min ago</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-yellow">16 June, 2019</div>
                        <h6 class="notice-title"><a href="#">Great School manag printing.</a></h6>
                        <div class="entry-meta"> Jennyfar Lopez / <span>5 min ago</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-pink">16 June, 2019</div>
                        <h6 class="notice-title"><a href="#">Great School manag Nulla rhoncus eleifensed
                                mim
                                us mi faucibus id. Mauris vestibulum non purus lobortismenearea</a></h6>
                        <div class="entry-meta"> Jennyfar Lopez / <span>5 min ago</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-skyblue">16 June, 2019</div>
                        <h6 class="notice-title"><a href="#">Great School manag mene esom text of the
                                printing.</a></h6>
                        <div class="entry-meta"> Jennyfar Lopez / <span>5 min ago</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-yellow">16 June, 2019</div>
                        <h6 class="notice-title"><a href="#">Great School manag printing.</a></h6>
                        <div class="entry-meta"> Jennyfar Lopez / <span>5 min ago</span></div>
                    </div>
                    <div class="notice-list">
                        <div class="post-date bg-pink">16 June, 2019</div>
                        <h6 class="notice-title"><a href="#">Great School manag meneesom.</a></h6>
                        <div class="entry-meta"> Jennyfar Lopez / <span>5 min ago</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
