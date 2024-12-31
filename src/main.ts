import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/routers/index';
import App from './App.vue';
import '@/assets/art.scss';

const app = createApp(App);
const pinia = createPinia();
app.use(router).use(pinia).mount('#app');
