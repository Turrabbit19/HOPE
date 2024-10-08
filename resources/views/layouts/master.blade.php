<!doctype html>
<html class="no-js" lang="">


<!-- Mirrored from www.radiustheme.com/demo/html/psdboss/akkhor/akkhor/index3.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 08 Oct 2024 08:15:22 GMT -->
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>AKKHOR | Home 3</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @include('layouts.partials.css')
    <script src="{{asset('assets/js/modernizr-3.6.0.min.js')}}"></script>
</head>

<body>
    <div id="preloader"></div>
    <div id="wrapper" class="wrapper bg-ash">
     
        <div class="navbar navbar-expand-md header-menu-one bg-light">
            @include('layouts.partials.logo')

            {{-- <div class="d-md-none mobile-nav-bar">
                <button class="navbar-toggler pulse-animation" type="button" data-toggle="collapse" data-target="#mobile-navbar" aria-expanded="false">
                    <i class="far fa-arrow-alt-circle-down"></i>
                </button>
                <button type="button" class="navbar-toggler sidebar-toggle-mobile">
                    <i class="fas fa-bars"></i>
                </button>
            </div> --}}

            @include('layouts.partials.header')
        </div>

        <div class="dashboard-page-one">
            <!-- Sidebar Area Start Here -->
            <div class="sidebar-main sidebar-menu-one sidebar-expand-md sidebar-color">
               <div class="mobile-sidebar-header d-md-none">
                    <div class="header-logo">
                        <a href="index.html"><img src="img/logo1.png" alt="logo"></a>
                    </div>
               </div>
               @include('layouts.partials.sidebar')
            </div>
       
            <div class="dashboard-content-one">
           
                    @include('layouts.partials.content-top')
            
                <div class="row">
             
                   @include('layouts.partials.content-left')
           
                    @include('layouts.partials.content-right')
                </div>

                <div class="row">
                    @include('layouts.partials.content-bottom1')
                    @include('layouts.partials.content-bottom2')
                    @include('layouts.partials.content-bottom3')
                </div>
        
                <footer class="footer-wrap-layout1">
                    @include('layouts.partials.footer')
                </footer>
        
            </div>
        </div>
        
    </div>
   @include('layouts.partials.js')
</body>


<!-- Mirrored from www.radiustheme.com/demo/html/psdboss/akkhor/akkhor/index3.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 08 Oct 2024 08:16:23 GMT -->
</html>