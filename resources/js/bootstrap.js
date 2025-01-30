import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import './echo';


window.Pusher = Pusher;
// console.log("Pusher Key:", import.meta.env.VITE_PUSHER_APP_KEY);
console.log("Pusher Key:", import.meta.env.VITE_PUSHER_APP_KEY); 

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,   // Correctly access Vite env variables
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
    disableStats: true,
});
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';



