<!doctype html>
<html class="no-js" lang="">


<!-- Mirrored from www.radiustheme.com/demo/html/psdboss/akkhor/akkhor/index3.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 08 Oct 2024 08:15:22 GMT -->

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>HOPE</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @include('client.layouts.css')
    <script src="{{ asset('assets/js/modernizr-3.6.0.min.js') }}"></script>
</head>

<body>
    <div id="preloader"></div>
    <div id="wrapper" class="wrapper bg-ash">

        <div class="navbar navbar-expand-md header-menu-one bg-light">
            @include('client.layouts.logo')

            {{-- <div class="d-md-none mobile-nav-bar">
                <button class="navbar-toggler pulse-animation" type="button" data-toggle="collapse" data-target="#mobile-navbar" aria-expanded="false">
                    <i class="far fa-arrow-alt-circle-down"></i>
                </button>
                <button type="button" class="navbar-toggler sidebar-toggle-mobile">
                    <i class="fas fa-bars"></i>
                </button>
            </div> --}}

            @include('client.layouts.header')
        </div>

        <div class="dashboard-page-one">
            <!-- Sidebar Area Start Here -->
            <div class="sidebar-main sidebar-menu-one sidebar-expand-md sidebar-color">
                <div class="mobile-sidebar-header d-md-none">
                    <div class="header-logo">
                        <a href="index.html"><img src="img/logo1.png" alt="logo"></a>
                    </div>
                </div>
                @include('client.layouts.sidebar')
            </div>

            <div class="dashboard-content-one">

             

                <div class="row">
                    @yield('content')
                </div>

                <footer class="footer-wrap-layout1">
                    @include('client.layouts.footer')
                </footer>

            </div>
        </div>

    </div>
    @include('client.layouts.js')
</body>


<!-- Mirrored from www.radiustheme.com/demo/html/psdboss/akkhor/akkhor/index3.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 08 Oct 2024 08:16:23 GMT -->

</html>
