import "./bootstrap";
window.Echo.channel("broadcast-notification").listen(
    "NewNotification",
    function (event) {
        console.log(event);
    }
);
