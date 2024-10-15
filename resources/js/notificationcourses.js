import './bootstrap';

window.Echo.channel('broadcast-notification-courses')
    .listen('NotificationCoursesEvent', function(event) {
        console.log(event);
    });
