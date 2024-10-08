$(document).ready(function(){var $wrapper=$('.main-wrapper');var $slimScrolls=$('.slimscroll');var $pageWrapper=$('.page-wrapper');feather.replace();$(window).resize(function(){if($('.page-wrapper').length>0){var height=$(window).height();$(".page-wrapper").css("min-height",height);}});$("#global-loader").fadeOut("slow");$('body').append('<div class="sidebar-overlay"></div>');$(document).on('click','#mobile_btn',function(){$wrapper.toggleClass('slide-nav');$('.sidebar-overlay').toggleClass('opened');$('html').addClass('menu-opened');$('#task_window').removeClass('opened');return false;});$(".sidebar-overlay").on("click",function(){$('html').removeClass('menu-opened');$(this).removeClass('opened');$wrapper.removeClass('slide-nav');$('.sidebar-overlay').removeClass('opened');$('#task_window').removeClass('opened');});$(document).on("click",".hideset",function(){$(this).parent().parent().parent().hide();});$(document).on("click",".delete-set",function(){$(this).parent().parent().hide();});if($(window).width()>767){if($('.theiaStickySidebar').length>0){$('.theiaStickySidebar').theiaStickySidebar({additionalMarginTop:30});}}
if($('.product-slide').length>0){$('.product-slide').owlCarousel({items:1,margin:30,dots:false,nav:true,loop:false,responsiveClass:true,responsive:{0:{items:1},800:{items:1},1170:{items:1}}});}
$('.notes-tog').on('click',function(){$('.section-bulk-widget').toggleClass('section-notes-dashboard');});$('.notes-tog').on('click',function(){$('.budget-role-notes').toggleClass('budgeted-role-notes');});$('.notes-tog').on('click',function(){$('.notes-page-wrapper').toggleClass('notes-tag-left');});if($('.notes-slider').length>0){$('.notes-slider').owlCarousel({loop:true,margin:24,dots:false,nav:true,smartSpeed:2000,navContainer:'.slide-nav5',navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1},768:{items:2},1300:{items:3}}})}
if($('.owl-product').length>0){var owl=$('.owl-product');owl.owlCarousel({margin:10,dots:false,nav:true,loop:false,touchDrag:false,mouseDrag:false,responsive:{0:{items:2},768:{items:4},1170:{items:8}}});}
if($('.datatable').length>0){$('.datatable').DataTable({"bFilter":true,"ordering":true,"info":false,"language":{search:' ',sLengthMenu:'Row Per Page _MENU_ Entries',searchPlaceholder:"Search",info:"_START_ - _END_ of _TOTAL_ items",paginate:{next:' Next',previous:'Prev '},}});}
function readURL(input){if(input.files&&input.files[0]){var reader=new FileReader();reader.onload=function(e){$('#blah').attr('src',e.target.result);}
reader.readAsDataURL(input.files[0]);}}
$("#imgInp").change(function(){readURL(this);});if($('.datetimepicker').length>0){$('.datetimepicker').datetimepicker({format:'DD-MM-YYYY',icons:{up:"fas fa-angle-up",down:"fas fa-angle-down",next:'fas fa-angle-right',previous:'fas fa-angle-left'}});}
if($('.toggle-password').length>0){$(document).on('click','.toggle-password',function(){$(this).toggleClass("ti-eye ti-eye-off");var input=$(".pass-input");if(input.attr("type")=="password"){input.attr("type","text");}else{input.attr("type","password");}});}
if($('.toggle-passwords').length>0){$(document).on('click','.toggle-passwords',function(){$(this).toggleClass("ti-eye ti-eye-off");var input=$(".pass-inputs");if(input.attr("type")=="password"){input.attr("type","text");}else{input.attr("type","password");}});}
if($('.toggle-passworda').length>0){$(document).on('click','.toggle-passworda',function(){$(this).toggleClass("ti-eye ti-eye-off");var input=$(".pass-inputa");if(input.attr("type")=="password"){input.attr("type","text");}else{setTimeout
input.attr("type","password");}});}
if($('.comming-soon-pg').length>0){let day=document.querySelector('.days');let hour=document.querySelector('.hours');let minute=document.querySelector('.minutes');let second=document.querySelector('.seconds');function setCountdown(){let countdownDate=new Date('Sep 30, 2024 16:00:00').getTime();let updateCount=setInterval(function(){let todayDate=new Date().getTime();let distance=countdownDate-todayDate;let days=Math.floor(distance/(1000*60*60*24));let hours=Math.floor(distance%(1000*60*60*24)/(1000*60*60));let minutes=Math.floor(distance%(1000*60*60)/(1000*60));let seconds=Math.floor(distance%(1000*60)/1000);day.textContent=days;hour.textContent=hours;minute.textContent=minutes;second.textContent=seconds;if(distance<0){clearInterval(updateCount);document.querySelector(".comming-soon-pg").innerHTML='<h1>EXPIRED</h1>'}},1000)}
setCountdown()}
if($('.select2').length>0){$(".select2").select2();}
if($('.select').length>0){$('.select').select2({minimumResultsForSearch:-1,width:'100%'});}
if($('.counter').length>0){$('.counter').counterUp({delay:20,time:2000});}
if($('#timer-countdown').length>0){$('#timer-countdown').countdown({from:180,to:0,movingUnit:1000,timerEnd:undefined,outputPattern:'$day Day $hour : $minute : $second',autostart:true});}
if($('#timer-countup').length>0){$('#timer-countup').countdown({from:0,to:180});}
if($('#timer-countinbetween').length>0){$('#timer-countinbetween').countdown({from:30,to:20});}
if($('#timer-countercallback').length>0){$('#timer-countercallback').countdown({from:10,to:0,timerEnd:function(){this.css({'text-decoration':'line-through'}).animate({'opacity':.5},500);}});}
if($('#timer-outputpattern').length>0){$('#timer-outputpattern').countdown({outputPattern:'$day Days $hour Hour $minute Min $second Sec..',from:60*60*24*3});}
if($('#summernote').length>0){$('#summernote').summernote({height:300,minHeight:null,maxHeight:null,focus:false});}
if($('#summernote2').length>0){$('#summernote2').summernote({height:300,minHeight:null,maxHeight:null,focus:true});}
if($('#summernote3').length>0){$('#summernote3').summernote({placeholder:'Type your message',height:300,minHeight:null,maxHeight:null,focus:true});}
if($('#summernote5').length>0){$('#summernote5').summernote({height:300,minHeight:null,maxHeight:null,focus:true});}
if($('.summernote').length>0){$('.summernote').summernote({minHeight:null,maxHeight:null,focus:true,toolbar:[['fontsize',['fontsize']],['font',['bold','italic','underline','clear','strikethrough']],['insert',['picture']]],});}
if($slimScrolls.length>0){$slimScrolls.slimScroll({height:'auto',width:'100%',position:'right',size:'7px',color:'#ccc',wheelStep:10,touchScrollStep:100});var wHeight=$(window).height()-60;$slimScrolls.height(wHeight);$('.sidebar .slimScrollDiv').height(wHeight);$(window).resize(function(){var rHeight=$(window).height()-60;$slimScrolls.height(rHeight);$('.sidebar .slimScrollDiv').height(rHeight);});}
var Sidemenu=function(){this.$menuItem=$('.sidebar-menu a');};function init(){var $this=Sidemenu;$('.sidebar-menu a').on('click',function(e){if($(this).parent().hasClass('submenu')){e.preventDefault();}
if(!$(this).hasClass('subdrop')){$('ul',$(this).parents('ul:first')).slideUp(250);$('a',$(this).parents('ul:first')).removeClass('subdrop');$(this).next('ul').slideDown(350);$(this).addClass('subdrop');}else if($(this).hasClass('subdrop')){$(this).removeClass('subdrop');$(this).next('ul').slideUp(350);}});$('.sidebar-menu ul li.submenu a.active').parents('li:last').children('a:first').addClass('active').trigger('click');}
init();$(document).on('mouseover',function(e){e.stopPropagation();if($('body').hasClass('mini-sidebar')&&$('#toggle_btn').is(':visible')){var targ=$(e.target).closest('.sidebar, .header-left').length;if(targ){$('body').addClass('expand-menu');$('.subdrop + ul').slideDown();}else{$('body').removeClass('expand-menu');$('.subdrop + ul').slideUp();}
return false;}});setTimeout(function(){$(document).ready(function(){$('.table').parent().addClass('table-responsive');});},1000);if($('.bookingrange').length>0){var start=moment().subtract(6,'days');var end=moment();function booking_range(start,end){$('.bookingrange span').html(start.format('M/D/YYYY')+' - '+end.format('M/D/YYYY'));}
$('.bookingrange').daterangepicker({startDate:start,endDate:end,ranges:{'Today':[moment(),moment()],'Yesterday':[moment().subtract(1,'days'),moment().subtract(1,'days')],'Last 7 Days':[moment().subtract(6,'days'),moment()],'Last 30 Days':[moment().subtract(29,'days'),moment()],'This Year':[moment().startOf('year'),moment().endOf('year')],'Next Year':[moment().add(1,'year').startOf('year'),moment().add(1,'year').endOf('year')]}},booking_range);booking_range(start,end);}
$(document).on('click','#toggle_btn',function(){if($('body').hasClass('mini-sidebar')){$('body').removeClass('mini-sidebar');$(this).addClass('active');$('.subdrop + ul');localStorage.setItem('screenModeNightTokenState','night');setTimeout(function(){$("body").removeClass("mini-sidebar");$(".header-left").addClass("active");},100);}else{$('body').addClass('mini-sidebar');$(this).removeClass('active');$('.subdrop + ul');localStorage.removeItem('screenModeNightTokenState','night');setTimeout(function(){$("body").addClass("mini-sidebar");$(".header-left").removeClass("active");},100);}
return false;});$(".next").on('click',function(){const nextTabLinkEl=$(".nav-tabs .active").closest("li").next("li").find("a")[0];const nextTab=new bootstrap.Tab(nextTabLinkEl);nextTab.show();});$(".previous").on('click',function(){const prevTabLinkEl=$(".nav-tabs .active").closest("li").prev("li").find("a")[0];const prevTab=new bootstrap.Tab(prevTabLinkEl);prevTab.show();});var myDiv=document.querySelector('.sticky-sidebar-one');$('.submenus').on('click',function(){$('body').addClass('sidebarrightmenu');});$('#searchdiv').on('click',function(){$('.searchinputs').addClass('show');});$('.search-addon span').on('click',function(){$('.searchinputs').removeClass('show');});$(document).on('click','#filter_search',function(){$('#filter_inputs').slideToggle("slow");});$(document).on('click','#filter_search1',function(){$('#filter_inputs1').slideToggle("slow");});$(document).on('click','#filter_search2',function(){$('#filter_inputs2').slideToggle("slow");});$(document).on('click','#filter_search3',function(){$('#filter_inputs3').slideToggle("slow");});$(document).on('click','#filter_search',function(){$('#filter_search').toggleClass("setclose");});$(document).on('click','#filter_search1',function(){$('#filter_search1').toggleClass("setclose");});$(document).on("click",".productset",function(){$(this).toggleClass("active");});$(document).on("click",".product-info",function(){$(this).toggleClass("active");});$(document).on("click",".layout-box",function(){$('.layout-hide-box').toggleClass("layout-show-box");});$(document).on("click",".select-option1",function(){$('.select-color-add').addClass("selected-color-add");});$('.bank-box').on('click',function(){$('.bank-box').removeClass('active');$(this).addClass('active');});$('.theme-image').on('click',function(){$('.theme-image').removeClass('active');$(this).addClass('active');});$('.themecolorset').on('click',function(){$('.themecolorset').removeClass('active');$(this).addClass('active');});$('.theme-layout').on('click',function(){$('.theme-layout').removeClass('active');$(this).addClass('active');});$('.inc.button').click(function(){var $this=$(this),$input=$this.prev('input'),$parent=$input.closest('div'),newValue=parseInt($input.val())+1;$parent.find('.inc').addClass('a'+newValue);$input.val(newValue);newValue+=newValue;});$('.dec.button').click(function(){var $this=$(this),$input=$this.next('input'),$parent=$input.closest('div'),newValue=parseInt($input.val())-1;console.log($parent);$parent.find('.inc').addClass('a'+newValue);$input.val(newValue);newValue+=newValue;});if($('.custom-file-container').length>0){var firstUpload=new FileUploadWithPreview('myFirstImage')
var secondUpload=new FileUploadWithPreview('mySecondImage')}
$('.counters').each(function(){var $this=$(this),countTo=$this.attr('data-count');$({countNum:$this.text()}).animate({countNum:countTo},{duration:2000,easing:'linear',step:function(){$this.text(Math.floor(this.countNum));},complete:function(){$this.text(this.countNum);}});});if($('.select-color-add').length>0){const colorSelect=document.getElementById('colorSelect');const inputBox=document.getElementById('inputBox');const inputShow=document.getElementById('input-show');const variantTable=document.getElementById('variant-table');colorSelect.addEventListener('change',function(){const selectedValue=colorSelect.value;inputShow.style.display="block"
variantTable.style.display="block"
inputBox.value=selectedValue;});}
if($('.toggle-password').length>0){$(document).on('click','.toggle-password',function(){$(this).toggleClass("fa-eye fa-eye");var input=$(".pass-input");if(input.attr("type")=="text"){input.attr("type","text");}else{input.attr("type","password");}});}
if($('.win-maximize').length>0){$('.win-maximize').on('click',function(e){if(!document.fullscreenElement){document.documentElement.requestFullscreen();}else{if(document.exitFullscreen){document.exitFullscreen();}}})}
$(document).on('click','#check_all',function(){$('.checkmail').click();return false;});if($('.checkmail').length>0){$('.checkmail').each(function(){$(this).on('click',function(){if($(this).closest('tr').hasClass('checked')){$(this).closest('tr').removeClass('checked');}else{$(this).closest('tr').addClass('checked');}});});}
if($('.popover-list').length>0){var popoverTriggerList=[].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList=popoverTriggerList.map(function(popoverTriggerEl){return new bootstrap.Popover(popoverTriggerEl)})}
if($('.clipboard').length>0){var clipboard=new Clipboard('.btn');}
var chatAppTarget=$('.chat-window');(function(){if($(window).width()>991)
chatAppTarget.removeClass('chat-slide');$(document).on("click",".chat-window .chat-users-list a.media",function(){if($(window).width()<=991){chatAppTarget.addClass('chat-slide');}
return false;});$(document).on("click","#back_user_list",function(){if($(window).width()<=991){chatAppTarget.removeClass('chat-slide');}
return false;});})();$(document).on('click','.mail-important',function(){$(this).find('i.fa').toggleClass('fa-star').toggleClass('fa-star-o');});var selectAllItems="#select-all2";var checkboxItem=".form-check.form-check-md :checkbox";$(selectAllItems).click(function(){if(this.checked){$(checkboxItem).each(function(){this.checked=true;});}else{$(checkboxItem).each(function(){this.checked=false;});}});var selectAllItems="#select-all3";var checkboxItem=".form-check.form-check-md :checkbox";$(selectAllItems).click(function(){if(this.checked){$(checkboxItem).each(function(){this.checked=true;});}else{$(checkboxItem).each(function(){this.checked=false;});}});if($('[data-bs-toggle="tooltip"]').length>0){var tooltipTriggerList=[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList=tooltipTriggerList.map(function(tooltipTriggerEl){return new bootstrap.Tooltip(tooltipTriggerEl)})}
var right_side_views='<div class="right-side-views d-none">'+
'<ul class="sticky-sidebar siderbar-view">'+
'<li class="sidebar-icons">'+
'<a class="toggle tipinfo open-layout open-siderbar" href="javascript:void(0);" data-toggle="tooltip" data-placement="left" data-bs-original-title="Tooltip on left">'+
'<div class="tooltip-five ">'+
'<img src="assets/img/icons/siderbar-icon2.svg" class="feather-five" alt="">'+
'<span class="tooltiptext">Check Layout</span>'+
'</div>'+
'</a>'+
'</li>'+
'</ul>'+
'</div>'+
'<div class="sidebar-layout">'+
'<div class="sidebar-content">'+
'<div class="sidebar-top">'+
'<div class="container-fluid">'+
'<div class="row align-items-center">'+
'<div class="col-xl-6 col-sm-6 col-12">'+
'<div class="sidebar-logo">'+
'<a href="index" class="logo">'+
'<img src="assets/img/logo.png" alt="Logo" class="img-flex">'+
'</a>'+
'</div>'+
'</div>'+
'<div class="col-xl-6 col-sm-6 col-12">'+
'<a class="btn-closed" href="javascript:void(0);"><img class="img-fliud" src="assets/img/icons/sidebar-delete-icon.svg" alt="demo"></a>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'<div class="container-fluid">'+
'<div class="row align-items-center">'+
'<h5 class="sidebar-title">Choose layout</h5>'+
'<div class="col-xl-12 col-sm-6 col-12">'+
'<div class="sidebar-image align-center">'+
'<img class="img-fliud" src="assets/img/demo-one.png" alt="demo">'+
'</div>'+
'<div class="row">'+
'<div class="col-lg-6 layout">'+
'<h5 class="layout-title">Dark Mode</h5>'+
'</div>'+
'<div class="col-lg-6 layout dark-mode">'+
'<label class="toggle-switch" for="notification_switch3">'+
'<span>'+
'<input type="checkbox" class="toggle-switch-input" id="notification_switch3">'+
'<span class="toggle-switch-label ms-auto">'+
'	<span class="toggle-switch-indicator"></span>'+
'</span>'+
'</span>'+
' </label>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
$("body").append(right_side_views);$('.open-layout').on("click",function(s){s.preventDefault();$('.sidebar-layout').addClass('show-layout');$('.sidebar-settings').removeClass('show-settings');});$('.btn-closed').on("click",function(s){s.preventDefault();$('.sidebar-layout').removeClass('show-layout');});$('.open-settings').on("click",function(s){s.preventDefault();$('.sidebar-settings').addClass('show-settings');$('.sidebar-layout').removeClass('show-layout');});$('.btn-closed').on("click",function(s){s.preventDefault();$('.sidebar-settings').removeClass('show-settings');});$('.open-siderbar').on("click",function(s){s.preventDefault();$('.siderbar-view').addClass('show-sidebar');});$('.btn-closed').on("click",function(s){s.preventDefault();$('.siderbar-view').removeClass('show-sidebar');});if($('.toggle-switch').length>0){const toggleSwitch=document.querySelector('.toggle-switch input[type="checkbox"]');const currentTheme=localStorage.getItem('theme');var app=document.getElementsByTagName("BODY")[0];if(currentTheme){app.setAttribute('data-theme',currentTheme);if(currentTheme==='dark'){toggleSwitch.checked=true;}}
function switchTheme(e){if(e.target.checked){app.setAttribute('data-theme','dark');localStorage.setItem('theme','dark');}
else{app.setAttribute('data-theme','light');localStorage.setItem('theme','light');}}
toggleSwitch.addEventListener('change',switchTheme,false);}
if(window.location.hash=="#LightMode"){localStorage.setItem('theme','dark');}
else{if(window.location.hash=="#DarkMode"){localStorage.setItem('theme','light');}}
$('ul.tabs li').click(function(){var $this=$(this);var $theTab=$(this).attr('id');console.log($theTab);if($this.hasClass('active')){}else{$this.closest('.tabs_wrapper').find('ul.tabs li, .tabs_container .tab_content').removeClass('active');$('.tabs_container .tab_content[data-tab="'+$theTab+'"], ul.tabs li[id="'+$theTab+'"]').addClass('active');}});'<div class="customizer-links">'+
'<ul class="sticky-sidebar">'+
'<li class="sidebar-icons">'+
'<a href="#" class="add-setting" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-original-title="Tooltip on left">'+
'<img src="assets/img/icons/sidebar-icon-01.svg" class="feather-five" alt="">'+
'</a>'+
'</li>'+
'<li class="sidebar-icons">'+
'<a href="#" class="navigation-add" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-original-title="Tooltip on left">'+
'<img src="assets/img/icons/sidebar-icon-02.svg" class="feather-five" alt="">'+
'</a>'+
'</li>'+
'<li class="sidebar-icons">'+
'<a href="https://themeforest.net/item/dreamspos-pos-inventory-management-admin-dashboard-template/38834413" target="_blank" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-original-title="Tooltip on left">'+
'<img src="assets/img/icons/sidebar-icon-03.svg" class="feather-five" alt="">'+
'</a>'+
'</li>'+
'</ul>'+
'</div>'+
'<div class="sidebar-settings preview-toggle">'+
'<div class="sidebar-content sticky-sidebar-one">'+
'<div class="sidebar-header">'+
'<h5>Preview Settings</h5>'+
'<a class="sidebar-close" href="#"><img src="assets/img/icons/close-icon.svg" alt=""></a>'+
'</div>'+
'<div class="sidebar-body">'+
'<h6 class="theme-title">Choose Mode</h6>'+
'<div class="switch-wrapper">'+
'<div id="dark-mode-toggle">'+
'<span class="light-mode active"> <img src="assets/img/icons/sun-icon.svg" class="me-2" alt=""> Light</span>'+
'<span class="dark-mode"><i class="far fa-moon me-2"></i> Dark</span>'+
'</div>'+
'</div>'+
'<div class="row  ">'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="1" class="check">'+
'<label for="1" class="checktoggle"><a  href="index.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">LTR</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-ltr.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="1" class="check">'+
'<label for="1" class="checktoggle"><a  href="../template-rtl/index.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">RTL</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-rtl.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'<div class="row  ">'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="3" class="check">'+
'<label for="3" class="checktoggle"><a  href="index-three.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">Boxed</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-04.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="3" class="check">'+
'<label for="3" class="checktoggle"><a  href="index-four.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">Collapsed</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-01.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'<div class="sidebar-settings nav-toggle">'+
'<div class="sidebar-content sticky-sidebar-one">'+
'<div class="sidebar-header">'+
'<h5>Navigation Settings</h5>'+
'<a class="sidebar-close" href="#"><img src="assets/img/icons/close-icon.svg" alt=""></a>'+
'</div>'+
'<div class="sidebar-body">'+
'<h6 class="theme-title">Navigation Type</h6>'+
'<div class="row  ">'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="1" class="check">'+
'<label for="1" class="checktoggle"><a  href="index.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">Vertical</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-03.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="2" class="check">'+
'<label for="2" class="checktoggle"><a  href="index-one.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">Horizontal</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-01.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="3" class="check">'+
'<label for="3" class="checktoggle"><a  href="index-four.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">Collapsed</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-01.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="3" class="check">'+
'<label for="3" class="checktoggle"><a  href="index-three.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">Modern</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-04.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'<div class="col-xl-6 ere">'+
'<div class="layout-wrap">'+
'<div class="d-flex align-items-center">'+
'<div class="status-toggle d-flex align-items-center me-2">'+
'<input type="checkbox" id="3" class="check">'+
'<label for="3" class="checktoggle"><a  href="index-two.html"class="layout-link">checkbox</a> </label>'+
'</div>'+
'<span class="status-text">Boxed</span>'+
'</div>'+
'<div class="layout-img">'+
'<img class="img-fliud" src="assets/img/theme/layout-03.png" alt="layout">'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>';$('.add-setting').on("click",function(e){e.preventDefault();$('.preview-toggle.sidebar-settings').addClass('show-settings');});$('.sidebar-close').on("click",function(e){e.preventDefault();$('.preview-toggle.sidebar-settings').removeClass('show-settings');document.body.style.overflow='auto';});$('.navigation-add').on("click",function(e){e.preventDefault();$('.nav-toggle.sidebar-settings').addClass('show-settings');document.body.style.overflow='hidden';});$('.sidebar-close').on("click",function(e){e.preventDefault();$('.nav-toggle.sidebar-settings').removeClass('show-settings');});$('.digit-group').find('input').each(function(){$(this).attr('maxlength',1);$(this).on('keyup',function(e){var parent=$($(this).parent());if(e.keyCode===8||e.keyCode===37){var prev=parent.find('input#'+$(this).data('previous'));if(prev.length){$(prev).select();}}
else if((e.keyCode>=48&&e.keyCode<=57)||(e.keyCode>=65&&e.keyCode<=90)||(e.keyCode>=96&&e.keyCode<=105)||e.keyCode===39){var next=parent.find('input#'+$(this).data('next'));if(next.length){$(next).select();}else{if(parent.data('autosubmit')){parent.submit();}}}});});$('.digit-group input').on('keyup',function(){var self=$(this);if(self.val()!=''){self.addClass('active');}else{self.removeClass('active');}});if($('input[name="datetimes"]').length>0){$('input[name="datetimes"]').daterangepicker({timePicker:true,startDate:moment().startOf('hour'),endDate:moment().startOf('hour').add(32,'hour'),locale:{format:'M/DD hh:mm A'}});}
if($('.top-online-contacts .swiper-container').length>0){var swiper=new Swiper('.top-online-contacts .swiper-container',{slidesPerView:5,spaceBetween:15,});}
$(".dream_profile_menu").on('click',function(){$('.right-side-contact').addClass('show-right-sidebar');$('.right-side-contact').removeClass('hide-right-sidebar');if($(window).width()>991&&$(window).width()<1201){$(".chat:not(.right-side-contact .chat)").css('margin-left',-chat_bar);$(".chat:not(.right_side_star .chat)").css('margin-left',-chat_bar);}
if($(window).width()<992){$('.chat:not(.right-side-contact .chat)').addClass('hide-chatbar');$('.chat:not(.right_side_star .chat)').addClass('hide-chatbar');}});$(".close_profile").on('click',function(){$('.right-side-contact').addClass('hide-right-sidebar');$('.right-side-contact').removeClass('show-right-sidebar');if($(window).width()>991&&$(window).width()<1201){$(".chat").css('margin-left',0);}
if($(window).width()<992){$('.chat').removeClass('hide-chatbar');}});if($('.emoj-action').length>0){$(".emoj-action").on('click',function(){$('.emoj-group-list').toggle();});}
if($('.emoj-action-foot').length>0){$(".emoj-action-foot").on('click',function(){$('.emoj-group-list-foot').toggle();});}
if($('.custom-input').length>0){const inputRange=document.querySelector('.custom-input');inputRange.addEventListener('input',function(){const progress=(inputRange.value-inputRange.min)/(inputRange.max-inputRange.min)*100;inputRange.style.background=`linear-gradient(to top, var(--md-sys-color-on-surface-variant) 0%, var(--md-sys-color-on-surface-variant) ${progress}%, var(--md-sys-color-surface-variant) ${progress}%, var(--md-sys-color-surface-variant) 100%)`;});}
if($('.mute-video').length>0){$(".mute-video").on('click',function(){if($(this).hasClass("stop")){$(this).removeClass("stop");$(".mute-video i").removeClass("bx-video-off");$(".mute-video i").addClass("bx-video");$(".join-call .join-video").removeClass("video-hide");$(".video-avatar").removeClass("active");$(this).attr("data-bs-original-title","Stop Camera");$(".meeting .join-video.user-active").removeClass("video-hide");$(".join-video.user-active .more-icon").removeClass("vid-view");$(".action-info.vid-view li .mute-vid i").removeClass("feather-video-off");$(".action-info.vid-view li .mute-vid i").addClass("feather-video");}
else{$(this).addClass("stop");$(".mute-video i").removeClass("bx-video");$(".mute-video i").addClass("bx-video-off");$(".join-call .join-video").addClass("video-hide");$(".video-avatar").addClass("active");$(this).attr("data-bs-original-title","Start Camera");$(".meeting .join-video.user-active").addClass("video-hide");$(".add-list .user-active .action-info").addClass("vid-view");$(".action-info.vid-view li .mute-vid i").removeClass("feather-video");$(".action-info.vid-view li .mute-vid i").addClass("feather-video-off");}});}
if($('.mute-bt').length>0){$(".mute-bt").on('click',function(){if($(this).hasClass("stop")){$(this).removeClass("stop");$(".mute-bt i").removeClass("bx-microphone-off");$(".mute-bt i").addClass("bx-microphone");$(this).attr("data-bs-original-title","Mute Audio");$(".join-video.user-active .more-icon").removeClass("mic-view");$(".action-info.vid-view li .mute-mic i").removeClass("feather-mic-off");$(".action-info.vid-view li .mute-mic i").addClass("feather-mic");}
else{$(this).addClass("stop");$(".mute-bt i").removeClass("bx-microphone");$(".mute-bt i").addClass("bx-microphone-off");$(this).attr("data-bs-original-title","Unmute Audio");$(".join-video.user-active .more-icon").addClass("mic-view");$(".add-list .user-active .action-info").addClass("vid-view");$(".action-info.vid-view li .mute-mic i").removeClass("feather-mic");$(".action-info.vid-view li .mute-mic i").addClass("feather-mic-off");}});}
if($('.other-mic-off').length>0){$(".other-mic-off i").on('click',function(){if($(this).parent().hasClass("stop")){$(this).parent().removeClass("stop");$(this).removeClass("bx-microphone-off");$(this).addClass("bx-microphone");}
else{$(this).parent().addClass("stop");$(this).removeClass("bx-microphone");$(this).addClass("bx-microphone-off");}});}
if($('.other-video-off').length>0){$(".other-video-off i").on('click',function(){if($(this).parent().hasClass("stop")){$(this).parent().removeClass("stop");$(this).removeClass("bx-video-off");$(this).addClass("bx-video");}
else{$(this).parent().addClass("stop");$(this).removeClass("bx-video");$(this).addClass("bx-video-off");}});}
if($('.video-slide').length>0){$('.video-slide').owlCarousel({items:4,loop:true,margin:24,nav:true,dots:false,autoplay:true,smartSpeed:1000,navText:['<i class="fa fa-angle-left" data-bs-toggle="tooltip" title="fa fa-angle-left"></i>','<i class="fa fa-angle-right" data-bs-toggle="tooltip" title="fa fa-angle-right"></i>'],responsive:{0:{items:1},500:{items:1},768:{items:3},991:{items:3},1200:{items:4},1401:{items:4}}})}
$(".close_profile").on("click",function(){$('.right-user-side').removeClass('open-message');$('.chat-center-blk .card-comman').addClass('chat-center-space');});$(".profile-open").on("click",function(){$('.right-user-side').removeClass('add-setting');$('.chat-center-blk .card-comman').removeClass('chat-center-space');});$("#call-chat").on("click",function(){$('.right-user-side').addClass('open-message');$('.video-screen-inner').addClass('video-space');});$(".close_profile").on("click",function(){$('.right-user-side').removeClass('open-message');$('.video-screen-inner').removeClass('video-space');$('.right-side-party').removeClass('open-message');$('.meeting-list').removeClass('add-meeting');$('#chat-room').removeClass('open-chats');$('.meeting-list').removeClass('add-meeting');$('.call-user-side').addClass('add-setting');});$("#add-partispant").on("click",function(){$('.right-side-party').addClass('open-message');$('#chat-room').removeClass('open-chats');$('.meeting-list').addClass('add-meeting');});$("#show-message").on("click",function(){$('#chat-room').addClass('open-chats');$('.right-side-party').removeClass('open-message');$('.meeting-list').addClass('add-meeting');});$('.chat-search-btn').on('click',function(){$('.chat-search').addClass('visible-chat');});$('.close-btn-chat').on('click',function(){$('.chat-search').removeClass('visible-chat');});$(".chat-search .form-control").on("keyup",function(){var value=$(this).val().toLowerCase();$(".chat .chat-body .messages .chats").filter(function(){$(this).toggle($(this).text().toLowerCase().indexOf(value)>-1)});});});var selectAllItems="#select-all";var checkboxItem=":checkbox";$(selectAllItems).click(function(){if(this.checked){$(checkboxItem).each(function(){this.checked=true;});}else{$(checkboxItem).each(function(){this.checked=false;});}});function toggleFullscreen(elem){elem=elem||document.documentElement;if(!document.fullscreenElement&&!document.mozFullScreenElement&&!document.webkitFullscreenElement&&!document.msFullscreenElement){if(elem.requestFullscreen){elem.requestFullscreen();}else if(elem.msRequestFullscreen){elem.msRequestFullscreen();}else if(elem.mozRequestFullScreen){elem.mozRequestFullScreen();}else if(elem.webkitRequestFullscreen){elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);}}else{if(document.exitFullscreen){document.exitFullscreen();}else if(document.msExitFullscreen){document.msExitFullscreen();}else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}else if(document.webkitExitFullscreen){document.webkitExitFullscreen();}}}
$(".quantity-btn").on("click",function(){var $button=$(this);var oldValue=$button.closest('.product-quantity').find("input.quntity-input").val();if($button.text()=="+"){var newVal=parseFloat(oldValue)+1;}else{if(oldValue>0){var newVal=parseFloat(oldValue)-1;}else{newVal=0;}}
$button.closest('.product-quantity').find("input.quntity-input").val(newVal);});$(document).on("click",".remove-product",function(){$(this).parent().parent().hide();});if($('.timepicker').length>0){$('.timepicker').datetimepicker({format:'HH:mm A',icons:{up:"fas fa-angle-up",down:"fas fa-angle-down",next:'fas fa-angle-right',previous:'fas fa-angle-left'}});}
$(".add-extra").on('click',function(){var servicecontent='<div class="row">'+
'<div class="col-lg-4 col-sm-6 col-12">'+
'<div class="form-group add-product">'+
'<div class="add-newplus">'+
'<label>Category</label>'+
'</div>'+
'<select class="select">'+
'<option>Choose</option>'+
'<option>Computers</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-4 col-sm-6 col-12">'+
'<div class="form-group add-product">'+
'<label>Choose Category</label>'+
'<select class="select">'+
'<option>Choose</option>'+
'<option>Computers</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-4 col-sm-6 col-12">'+
'<div class="d-flex align-items-center">'+
'<div class="form-group w-100 add-product">'+
'<label>Sub Category</label>'+
'<select class="select">'+
'<option>Choose</option>'+
'<option>Computers</option>'+
'</select>'+
'</div>'+
'<div class="input-blocks">'+
'<a href="#" class="btn btn-danger-outline trash"><i class="far fa-trash-alt"></i></a>'+
'</div>'+
'</div>'+
'</div>';setTimeout(function(){$('.select');setTimeout(function(){$('.select').select2({minimumResultsForSearch:-1,width:'100%'});},100);},100);$(".addservice-info").append(servicecontent);return false;});$(".add-extra-item-two").on('click',function(){var servicecontent='<div class="row">'+
'<div class="col-lg-4 col-sm-6 col-12">'+
'<div class="form-group add-product">'+
'<div class="add-newplus">'+
'<label>Brand</label>'+
'</div>'+
'<select class="select">'+
'<option>Choose</option>'+
'<option>Computers</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-4 col-sm-6 col-12">'+
'<div class="form-group add-product">'+
'<label>Unit</label>'+
'<select class="select">'+
'<option>Choose</option>'+
'<option>Computers</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-4 col-sm-6 col-12">'+
'<div class="d-flex align-items-center">'+
'<div class="form-group w-100 add-product">'+
'<label>Selling Type</label>'+
'<select class="select">'+
'<option>Choose</option>'+
'<option>Computers</option>'+
'</select>'+
'</div>'+
'<div class="input-blocks">'+
'<a href="#" class="btn btn-danger-outline trash"><i class="far fa-trash-alt"></i></a>'+
'</div>'+
'</div>'+
'</div>';setTimeout(function(){$('.select');setTimeout(function(){$('.select').select2({minimumResultsForSearch:-1,width:'100%'});},100);},100);$(".add-product-new").append(servicecontent);return false;});$(document).on("click",".remove-color",function(){$(this).parent().parent().parent().hide();});if($('#btnFullscreen').length>0){document.getElementById('btnFullscreen').addEventListener('click',function(){toggleFullscreen();});}
$(document).ready(function(){if($('#collapse-header').length>0){document.getElementById('collapse-header').onclick=function(){this.classList.toggle('active');document.body.classList.toggle('header-collapse');}}
if($('#file-delete').length>0){$("#file-delete").on("click",function(){$('.deleted-table').addClass('d-none');$('.deleted-info').addClass('d-block');});}
if($('.pos-category').length>0){$('.pos-category').owlCarousel({items:6,loop:false,margin:8,nav:true,dots:false,autoplay:false,smartSpeed:1000,navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:2},500:{items:3},768:{items:4},991:{items:5},1200:{items:6},1401:{items:6}}})}
if($('.folders-carousel').length>0){$('.folders-carousel').owlCarousel({loop:true,margin:15,items:2,nav:true,dots:false,navContainer:'.slide-nav6',navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1},768:{items:2},1400:{items:3}}});}
if($('.files-carousel').length>0){$('.files-carousel').owlCarousel({items:3,loop:true,margin:15,nav:true,dots:false,navContainer:'.slide-nav7',smartSpeed:1000,navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1},768:{items:2},1200:{items:3}}})}
if($('.video-section').length>0){$('.video-section').owlCarousel({loop:true,margin:15,items:3,nav:true,dots:false,navContainer:'.slide-nav8',navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1},768:{items:2},1200:{items:3}}});var playerSettings={controls:['play-large'],fullscreen:{enabled:false},resetOnEnd:true,hideControls:true,clickToPlay:true,keyboard:false,}
const players=Plyr.setup('.js-player',playerSettings);players.forEach(function(instance,index){instance.on('play',function(){players.forEach(function(instance1,index1){if(instance!=instance1){instance1.pause();}});});});$('.video-section').on('translated.owl.carousel',function(event){players.forEach(function(instance,index1){instance.pause();});});}
if($('.video-section').length>0||('.files-carousel').length>0||('.folders-carousel').length>0){$('.video-section, .files-carousel, .folders-carousel').each(function(){let carousel=$(this);carousel.on('show.bs.dropdown','[data-bs-toggle=dropdown]',function(){let dropdown=bootstrap.Dropdown.getInstance(this);$(dropdown._menu).insertAfter(carousel);$(this).next('.dropdown-menu').insertAfter(carousel);});})}
$(".inc").on('click',function(){updateValue(this,1);});$(".dec").on('click',function(){updateValue(this,-1);});function updateValue(obj,delta){var item=$(obj).parent().find("input");var newValue=parseInt(item.val(),10)+delta;item.val(Math.max(newValue,0));}
let DIV_CARD=".card";let cardFullscreenBtn=document.querySelectorAll('[data-bs-toggle="card-fullscreen"]');cardFullscreenBtn.forEach((ele)=>{ele.addEventListener("click",function(e){let $this=this;let card=$this.closest(DIV_CARD);card.classList.toggle("card-fullscreen");card.classList.remove("card-collapsed");e.preventDefault();return false;});});let DIV_CARD_CLOSE=".card";let cardRemoveBtn=document.querySelectorAll('[data-bs-toggle="card-remove"]');cardRemoveBtn.forEach((ele)=>{ele.addEventListener("click",function(e){e.preventDefault();let $this=this;let card=$this.closest(DIV_CARD_CLOSE);card.remove();return false;});});if($('.add-popup').length>0){$(".add-popup").on("click",function(){$('.toggle-popup').addClass('sidebar-popup');});$(".sidebar-close").on("click",function(){$('.toggle-popup').removeClass('sidebar-popup');});}
setTimeout(function(){$(".edit-popup").on("click",function(){$('.toggle-popup1').addClass('sidebar-popup');});$(".sidebar-close1").on("click",function(){$('.toggle-popup1').removeClass('sidebar-popup');});},100);if($('.select-people-checkbox').length>0){$(document).on('click','.select-people-checkbox',function(){$(this).toggleClass('checkbox-checked');$(this).find("input").attr('checked','checked');if($(this).hasClass('checkbox-checked')){$(this).find("input").attr('checked','checked');}
else{$(this).find("input").removeAttr('checked','');}
return false;});}
setTimeout(function(){$(".rating-select").on('click',function(){$(this).toggleClass("filled");});},100);if($('.datanew').length>0){$('.datanew').DataTable({"bFilter":true,"ordering":true,"language":{search:' ',sLengthMenu:'_MENU_',searchPlaceholder:"Search",info:"_START_ - _END_ of _TOTAL_ items",paginate:{next:'Next',previous:'Prev'},},initComplete:(settings,json)=>{$('.dataTables_length').appendTo('.datatable-length');$('.dataTables_paginate').appendTo('.datatable-paginate');$('.dataTables_info').appendTo('.datatable-info');$('.dataTables_filter').appendTo('.datatable-search');},});}
$(function(){$(".form-filter .dropdown-toggle").on("click",function(a){$(".form-filter").removeClass("table-filter-show");$(this).closest('.form-filter').toggleClass("table-filter-show");a.stopPropagation()});$(document).on("click",function(a){if($(a.target).is(".form-filter")===false){$(".form-filter").removeClass("table-filter-show");}});});$('.filter-drop-items').on('click',function(event){event.stopPropagation();});if($('.total-periods-slider').length>0){$('.total-periods-slider').owlCarousel({items:4,loop:true,margin:5,nav:false,dots:false,autoplay:false,smartSpeed:1000,responsive:{0:{items:1},576:{items:2},768:{items:3},1200:{items:3},1401:{items:4},1801:{items:5}}})}
if($('.time-table-slider').length>0){$('.time-table-slider').owlCarousel({items:4,loop:true,margin:5,nav:false,dots:false,autoplay:false,smartSpeed:1000,responsive:{0:{items:1},576:{items:2},768:{items:3},1200:{items:5},1401:{items:6},1801:{items:7}}})}
$(".addsibling-info").on('click','.trash-icon',function(){$(this).closest('.sibling-cont').remove();return false;});$(".add-sibling").on('click',function(){var servicecontent='<div class="row sibling-cont">'+
'<div class="col-lg-3 col-md-6">'+
'<div class="mb-4">'+
'<label class="form-label">Name</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>Newyork</option>'+
'<option>Denver</option>'+
'<option>Chicago</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-3 col-md-6">'+
'<div class="mb-4">'+
'<label class="form-label">Roll No</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>35013</option>'+
'<option>35011</option>'+
'<option>35010</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-3 col-md-6">'+
'<div class="mb-4">'+
'<label class="form-label">Admission No</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>AD9892434</option>'+
'<option>AD9892433</option>'+
'<option>AD9892432</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-3 col-md-6">'+
'<div class="mb-4">'+
'<div class="d-flex align-items-center">'+
'<div class="w-100">'+
'<label class="form-label">Class</label>'+
'<select class="select w-100">'+
'<option>Select</option>'+
'<option>I</option>'+
'<option>II</option>'+
'<option>III</option>'+
'</select>'+
'</div>'+
'<div>'+
'<label class="form-label">&nbsp;</label>'+
'<a href="javascript:void(0);" class="trash-icon ms-3"><i class="ti ti-trash-x"></i></a>'+
'</div>'+
'</div>'+
'</div>'+
'</div>';setTimeout(function(){$('.select');setTimeout(function(){$('.select').select2({minimumResultsForSearch:-1,width:'100%'});},100);},100);$(".addsibling-info").append(servicecontent);return false;});$(".promote-students-btn").on("click",function(){$(".promote-card-main").addClass("promote-card-main-show");});$(".reset-promote").on("click",function(){$(".promote-card-main").removeClass("promote-card-main-show");});if($('.routine-slider').length>0){$('.routine-slider').owlCarousel({items:4,loop:true,margin:15,nav:false,dots:false,autoplay:false,smartSpeed:1000,responsive:{0:{items:1},576:{items:2},768:{items:3},1200:{items:2},1300:{items:3},1400:{items:4}}})}
if($('.yearpicker').length>0){$('.yearpicker').datetimepicker({viewMode:'years',format:'MMM YYYY',icons:{up:"fas fa-angle-up",down:"fas fa-angle-down",next:'fas fa-angle-right',previous:'fas fa-angle-left'}});}
$('.image-sign').on('change',function(){$(this).closest('.upload-pic').find(".frames").html('');for(var i=0;i<$(this)[0].files.length;i++){$(this).closest('.upload-pic').find(".frames").append('<img src="'+window.URL.createObjectURL(this.files[i])+'" width="100px" height="100px">');}});$("#students").on("change",function(){$(".all-content").removeClass("active");$("#all-student").addClass("active");});$("#staffs").on("change",function(){$(".all-content").removeClass("active");$("#all-staffs").addClass("active");});$("#all").on("change",function(){$(".all-content").removeClass("active");});if($('.btn-view').length>0){$('.btn-view').on('click',function(){$(this).closest('.ticket-wrap').find(".ticket-view").slideToggle(500);});}
$(".add-new-timetable").on('click',function(){var timetablecontent='<div class="row timetable-count">'+
'<div class="col-lg-3">'+
'<div class="mb-3">'+
'<label class="form-label">Subject</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>English</option>'+
'<option>Spanish</option>'+
'<option>Physics</option>'+
'<option>Maths</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-3">'+
'<div class="mb-3">'+
'<label class="form-label">Teacher</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>Hellana</option>'+
'<option>Erickson</option>'+
'<option>Teresa</option>'+
'<option>Aaron</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-3">'+
'<div class="mb-3">'+
'<label class="form-label">Time From</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>09:00</option>'+
'<option>09:45</option>'+
'<option>10:45</option>'+
'<option>11:30</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-lg-3">'+
'<div class="d-flex align-items-end">'+
'<div class="mb-3 flex-fill">'+
'<label class="form-label">Time To</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>09:45</option>'+
'<option>10:45</option>'+
'<option>11:30</option>'+
'<option>12:15</option>'+
'</select>'+
'</div>'+
'<div class="mb-3 ms-2">'+
'<a href="#" class="delete-time-table"><i class="ti ti-trash"></i></a>'+
'</div>'+
'</div>'+
'</div>'+
'</div>';setTimeout(function(){$('.select');setTimeout(function(){$('.select').select2({minimumResultsForSearch:-1,width:'100%'});},100);},100);$(".add-timetable-row").append(timetablecontent);return false;});$(".add-timetable-row").on('click','.delete-time-table',function(){$(this).closest('.timetable-count').remove();return false;});$(".add-new-schedule").on('click',function(){var examschedule='<div class="exam-schedule-row d-flex align-items-center flex-wrap column-gap-3">'+
'<div class="shedule-info flex-fill">'+
'<div class="mb-3">'+
'<label class="form-label">Exam Date</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>13 May 2024</option>'+
'<option>14 May 2024</option>'+
'<option>15 May 2024</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="shedule-info flex-fill">'+
'<div class="mb-3">'+
'<label class="form-label">Teacher</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>English</option>'+
'<option>Spanish</option>'+
'<option>Physics</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="shedule-info flex-fill">'+
'<div class="mb-3">'+
'<label class="form-label">Room No</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>101</option>'+
'<option>103</option>'+
'<option>104</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="shedule-info flex-fill">'+
'<div class="mb-3">'+
'<label class="form-label">Max Marks</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>100</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="shedule-info flex-fill">'+
'<div class="d-flex align-items-end">'+
'<div class="mb-3 flex-fill">'+
'<label class="form-label">Min Marks</label>'+
'<select class="select">'+
'<option>Select</option>'+
'<option>35</option>'+
'</select>'+
'</div>'+
'<div class="mb-3 ms-2">'+
'<a href="#" class="delete-schedule-table"><i class="ti ti-trash"></i></a>'+
'</div>'+
'</div>'+
'</div>';setTimeout(function(){$('.select');setTimeout(function(){$('.select').select2({minimumResultsForSearch:-1,width:'100%'});},100);},100);$(".exam-schedule-add").append(examschedule);return false;});$(".exam-schedule-add").on('click','.delete-schedule-table',function(){$(this).closest('.exam-schedule-row').remove();return false;});$(".percentage-radio").on("click",function(){$(".percentage-field").addClass("percentage-field-show");});$(".fixed-radio").on("click",function(){$(".fixed-field").addClass("fixed-field-show");});$("input[type='radio']").not(".percentage-radio").on("click",function(){$(".percentage-field").removeClass("percentage-field-show");});$("input[type='radio']").not(".fixed-radio").on("click",function(){$(".fixed-field").removeClass("fixed-field-show");});if($('.datepic').length>0){$('.datepic').datetimepicker({format:'DD-MM-YYYY',keepOpen:true,inline:true,icons:{up:"fas fa-angle-up",down:"fas fa-angle-down",next:'fas fa-angle-right',previous:'fas fa-angle-left'}});}
if($('.inner-pages-slider').length>0){$('.inner-pages-slider').owlCarousel({items:5,loop:true,margin:15,nav:true,dots:false,smartSpeed:1000,navContainer:'.slide-nav2',navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1},768:{items:3},1200:{items:5}}})}
if($('.teachers-profile-slider').length>0){$('.teachers-profile-slider').owlCarousel({items:5,loop:true,margin:15,nav:true,dots:false,smartSpeed:1000,navContainer:'.slide-nav',navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1},768:{items:3},1200:{items:5}}})}
if($('.link-slider').length>0){$('.link-slider').owlCarousel({items:3,loop:true,margin:24,nav:false,dots:false,autoplay:false,smartSpeed:1000,responsive:{0:{items:1},576:{items:2},768:{items:3},1200:{items:3},1400:{items:2},1500:{items:3}}})}
if($('.link-slider-rtl').length>0){$('.link-slider-rtl').owlCarousel({items:3,loop:true,margin:24,nav:false,dots:false,autoplay:false,smartSpeed:1000,rtl:true,responsive:{0:{items:1},576:{items:2},768:{items:3},1200:{items:3},1400:{items:2},1500:{items:3}}})}
if($('.student-slider').length>0){$('.student-slider').owlCarousel({loop:true,margin:24,nav:true,dots:false,autoplay:false,smartSpeed:1000,navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1}}})}
if($('.student-slider-rtl').length>0){$('.student-slider-rtl').owlCarousel({loop:true,margin:24,nav:true,dots:false,autoplay:false,smartSpeed:1000,rtl:true,navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1}}})}
if($('.teacher-slider').length>0){$('.teacher-slider').owlCarousel({loop:true,margin:24,nav:true,dots:false,autoplay:false,smartSpeed:1000,navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1}}})}
if($('.teacher-slider-rtl').length>0){$('.teacher-slider-rtl').owlCarousel({loop:true,margin:24,nav:true,dots:false,autoplay:false,smartSpeed:1000,rtl:true,navText:['<i class="fas fa-chevron-left"></i>','<i class="fas fa-chevron-right"></i>'],responsive:{0:{items:1}}})}
$('.todo-inbox-check input').click(function(){$(this).parent().parent().toggleClass('todo-strike-content');});$('.todo-list input').click(function(){$(this).parent().parent().toggleClass('todo-strike-content');});$(".student-active a").on('click',function(){$(this).addClass("active").siblings().removeClass('active');});$(function(){$("#notification_popup").on("click",function(a){$("#notification_item").toggleClass("notification-item-show");a.stopPropagation()});$(document).on("click",function(a){if($(a.target).is("#notification_item")===false){$("#notification_item").removeClass("notification-item-show");}});});$('.notification-dropdown').on('click',function(event){event.stopPropagation();});if($('.lesson').length>0){$('.lesson').owlCarousel({items:3,loop:true,margin:15,nav:true,dots:false,smartSpeed:1000,navContainer:'.slide-nav3',navText:['<i class="ti ti-chevron-left"></i>','<i class="ti ti-chevron-right"></i>'],responsive:{0:{items:1},768:{items:2},1200:{items:4}}})}
if($('.task-slider').length>0){$('.task-slider').owlCarousel({items:3,loop:true,margin:15,nav:true,dots:false,smartSpeed:1000,navContainer:'.slide-nav2',navText:['<i class="ti ti-chevron-left"></i>','<i class="ti ti-chevron-right"></i>'],responsive:{0:{items:1},768:{items:2},1200:{items:4},1400:{items:4}}})}
$(function(){$(".circle-progress").each(function(){var value=$(this).attr('data-value');var left=$(this).find('.progress-left .progress-bar');var right=$(this).find('.progress-right .progress-bar');if(value>0){if(value<=50){right.css('transform','rotate('+percentageToDegrees(value)+'deg)')}else{right.css('transform','rotate(180deg)')
left.css('transform','rotate('+percentageToDegrees(value-50)+'deg)')}}})
function percentageToDegrees(percentage){return percentage/100*360}});});