<<<<<<< HEAD
import './bootstrap';

window.Echo.channel('broadcast-notification')
    .listen('NotificationEvent', function(event) {
        console.log(event);
    });
=======
import "./bootstrap";
window.Echo.channel("broadcast-notification").listen(
    "NewNotification",
    function (event) {
        console.log(event);
    }
);
>>>>>>> beb685d65dd80b4493afdaa6f4a8c6188e2f2280
