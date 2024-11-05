<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
<<<<<<< HEAD
Broadcast::channel('broadcast-notification', function () {
    return true;
});
Broadcast::channel('broadcast-notification-courses', function () {
    return true;
});
=======

// Nhận thông báo bên FE
Broadcast::channel('broadcast-notification', function () {
    return true;
});
>>>>>>> beb685d65dd80b4493afdaa6f4a8c6188e2f2280
