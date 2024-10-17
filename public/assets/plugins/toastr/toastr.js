$(function(){"use strict";var t,o="rtl"===$("html").attr("data-textdirection"),n=$("#type-success"),i=$("#type-info"),s=$("#type-warning"),a=$("#type-error"),e=$("#position-top-left"),r=$("#position-top-center"),c=$("#position-top-right"),l=$("#position-top-full"),u=$("#position-bottom-left"),h=$("#position-bottom-center"),f=$("#position-bottom-right"),m=$("#position-bottom-full"),d=$("#text-notification"),k=$("#close-button"),p=$("#progress-bar"),w=$("#clear-toast-btn"),y=$("#show-remove-toast"),g=$("#remove-toast"),b=$("#show-clear-toast"),v=$("#clear-toast"),B=$("#fast-duration"),I=$("#slow-duration"),M=$("#timeout"),T=$("#sticky"),C=$("#slide-toast"),D=$("#fade-toast");n.on("click",function(){toastr.success("Have fun storming the castle!","Miracle Max Says",{closeButton:!0,tapToDismiss:!1,rtl:o})}),i.on("click",function(){toastr.info("We do have the Kapua suite available.","Turtle Bay Resort",{closeButton:!0,tapToDismiss:!1,rtl:o})}),s.on("click",function(){toastr.warning("My name is Inigo Montoya. You killed my father, prepare to die!",{closeButton:!0,tapToDismiss:!1,rtl:o})}),a.on("click",function(){toastr.error("I do not think that word means what you think it means.","Inconceivable!",{closeButton:!0,tapToDismiss:!1,rtl:o})}),e.on("click",function(){toastr.info("I do not think that word means what you think it means.","Top Left!",{positionClass:"toast-top-left",rtl:o})}),r.on("click",function(){toastr.info("I do not think that word means what you think it means.","Top Center!",{positionClass:"toast-top-center",rtl:o})}),c.on("click",function(){toastr.info("I do not think that word means what you think it means.","Top Right!",{positionClass:"toast-top-right",rtl:o})}),l.on("click",function(){toastr.info("I do not think that word means what you think it means.","Top Full Width!",{positionClass:"toast-top-full-width",rtl:o})}),u.on("click",function(){toastr.info("I do not think that word means what you think it means.","Bottom Left!",{positionClass:"toast-bottom-left",rtl:o})}),h.on("click",function(){toastr.info("I do not think that word means what you think it means.","Bottom Center!",{positionClass:"toast-bottom-center",rtl:o})}),f.on("click",function(){toastr.info("I do not think that word means what you think it means.","Bottom Right!",{positionClass:"toast-bottom-right",rtl:o})}),m.on("click",function(){toastr.info("I do not think that word means what you think it means.","Bottom Full Width!",{positionClass:"toast-bottom-full-width",rtl:o})}),d.on("click",function(){toastr.info("Have fun storming the castle!","Miracle Max Says",{rtl:o})}),k.on("click",function(){toastr.success("Have fun storming the castle!","With Close Button",{closeButton:!0,rtl:o})}),p.on("click",function(){toastr.success("Have fun storming the castle!","Progress Bar",{closeButton:!0,tapToDismiss:!1,progressBar:!0,rtl:o})}),w.on("click",function(){(t=t||toastr.info('Clear itself?<br /><br /><button type="button" class="btn btn-primary clear">Yes</button>',"Clear Toast Button",{closeButton:!0,timeOut:0,extendedTimeOut:0,tapToDismiss:!1,rtl:o})).find(".clear").length&&t.delegate(".clear","click",function(){toastr.clear(t,{force:!0}),t=void 0})}),y.on("click",function(){toastr.info("Have fun storming the castle!","Miracle Max Says",{rtl:o})}),g.on("click",function(){toastr.remove()}),b.on("click",function(){toastr.info("Have fun storming the castle!","Miracle Max Says",{rtl:o})}),v.on("click",function(){toastr.clear()}),B.on("click",function(){toastr.success("Have fun storming the castle!","Fast Duration",{showDuration:500,rtl:o})}),I.on("click",function(){toastr.warning("Have fun storming the castle!","Slow Duration",{hideDuration:3e3,rtl:o})}),M.on("click",function(){toastr.error("I do not think that word means what you think it means.","Timeout!",{timeOut:5e3,rtl:o})}),T.on("click",function(){toastr.info("I do not think that word means what you think it means.","Sticky!",{timeOut:0,rtl:o})}),C.on("click",function(){toastr.success("I do not think that word means what you think it means.","Slide Down / Slide Up!",{showMethod:"slideDown",hideMethod:"slideUp",timeOut:2e3,rtl:o})}),D.on("click",function(){toastr.success("I do not think that word means what you think it means.","Slide Down / Slide Up!",{showMethod:"fadeIn",hideMethod:"fadeOut",timeOut:2e3,rtl:o})})});(function(){'use strict';const toastTrigger=document.getElementById('liveToastBtn')
const toastLiveExample=document.getElementById('liveToast')
if(toastTrigger){toastTrigger.addEventListener('click',()=>{const toast=new bootstrap.Toast(toastLiveExample)
toast.show()})}
const primaryToast=document.getElementById('primaryToastBtn')
const primarytoastExample=document.getElementById('primaryToast')
if(primaryToast){primaryToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(primarytoastExample)
toast.show()})}
const secondaryToast=document.getElementById('secondaryToastBtn')
const secondarytoastExample=document.getElementById('secondaryToast')
if(secondaryToast){secondaryToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(secondarytoastExample)
toast.show()})}
const infoToast=document.getElementById('infoToastBtn')
const infotoastExample=document.getElementById('infoToast')
if(infoToast){infoToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(infotoastExample)
toast.show()})}
const warningToast=document.getElementById('warningToastBtn')
const warningtoastExample=document.getElementById('warningToast')
if(warningToast){warningToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(warningtoastExample)
toast.show()})}
const successToast=document.getElementById('successToastBtn')
const successtoastExample=document.getElementById('successToast')
if(successToast){successToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(successtoastExample)
toast.show()})}
const dangerToast=document.getElementById('dangerToastBtn')
const dangertoastExample=document.getElementById('dangerToast')
if(dangerToast){dangerToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(dangertoastExample)
toast.show()})}
const solidprimaryToast=document.getElementById('solidprimaryToastBtn')
const solidprimarytoastExample=document.getElementById('solid-primaryToast')
if(solidprimaryToast){solidprimaryToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(solidprimarytoastExample)
toast.show()})}
const solidsecondaryToast=document.getElementById('solidsecondaryToastBtn')
const solidsecondarytoastExample=document.getElementById('solid-secondaryToast')
if(solidsecondaryToast){solidsecondaryToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(solidsecondarytoastExample)
toast.show()})}
const solidinfoToast=document.getElementById('solidinfoToastBtn')
const solidinfotoastExample=document.getElementById('solid-infoToast')
if(solidinfoToast){solidinfoToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(solidinfotoastExample)
toast.show()})}
const solidwarningToast=document.getElementById('solidwarningToastBtn')
const solidwarningtoastExample=document.getElementById('solid-warningToast')
if(solidwarningToast){solidwarningToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(solidwarningtoastExample)
toast.show()})}
const solidsuccessToast=document.getElementById('solidsuccessToastBtn')
const solidsuccesstoastExample=document.getElementById('solid-successToast')
if(solidsuccessToast){solidsuccessToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(solidsuccesstoastExample)
toast.show()})}
const soliddangerToast=document.getElementById('soliddangerToastBtn')
const soliddangertoastExample=document.getElementById('solid-dangerToast')
if(soliddangerToast){soliddangerToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(soliddangertoastExample)
toast.show()})}
const topleftToast=document.getElementById('topleftToastBtn')
const toplefttoastExample=document.getElementById('topleft-Toast')
if(topleftToast){topleftToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(toplefttoastExample)
toast.show()})}
const topcenterToast=document.getElementById('topcenterToastBtn')
const topcentertoastExample=document.getElementById('topcenter-Toast')
if(topcenterToast){topcenterToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(topcentertoastExample)
toast.show()})}
const toprightToast=document.getElementById('toprightToastBtn')
const toprighttoastExample=document.getElementById('topright-Toast')
if(toprightToast){toprightToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(toprighttoastExample)
toast.show()})}
const middleleftToast=document.getElementById('middleleftToastBtn')
const middlelefttoastExample=document.getElementById('middleleft-Toast')
if(middleleftToast){middleleftToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(middlelefttoastExample)
toast.show()})}
const middlecenterToast=document.getElementById('middlecenterToastBtn')
const middlecentertoastExample=document.getElementById('middlecenter-Toast')
if(middlecenterToast){middlecenterToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(middlecentertoastExample)
toast.show()})}
const middlerightToast=document.getElementById('middlerightToastBtn')
const middlerighttoastExample=document.getElementById('middleright-Toast')
if(middlerightToast){middlerightToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(middlerighttoastExample)
toast.show()})}
const bottomleftToast=document.getElementById('bottomleftToastBtn')
const bottomlefttoastExample=document.getElementById('bottomleft-Toast')
if(bottomleftToast){bottomleftToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(bottomlefttoastExample)
toast.show()})}
const bottomcenterToast=document.getElementById('bottomcenterToastBtn')
const bottomcentertoastExample=document.getElementById('bottomcenter-Toast')
if(bottomcenterToast){bottomcenterToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(bottomcentertoastExample)
toast.show()})}
const bottomrightToast=document.getElementById('bottomrightToastBtn')
const bottomrighttoastExample=document.getElementById('bottomright-Toast')
if(bottomrightToast){bottomrightToast.addEventListener('click',()=>{const toast=new bootstrap.Toast(bottomrighttoastExample)
toast.show()})}})();