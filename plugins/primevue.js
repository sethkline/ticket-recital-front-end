// plugins/primevue.js
import { defineNuxtPlugin } from '#app';
import ToastService from 'primevue/toastservice';
// import 'primevue/resources/themes/saga-blue/theme.css'  // theme
// import 'primevue/resources/primevue.min.css'            // core css
// import 'primeicons/primeicons.css'                      // icons

export default defineNuxtPlugin(nuxtApp => {
    // nuxtApp.vueApp.use(PrimeVue, { ripple: true });
    nuxtApp.vueApp.use(ToastService);
});
