import "./bootstrap";
window.Echo.channel("broadcast-notification").listen(
    "NotificationEvent",
    function (event) {
        console.log(event);
    }
);
