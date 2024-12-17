import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "f650654bdf3cd1fbfab2",
  cluster: "ap1",
  forceTLS: true,
});

export default echo;
