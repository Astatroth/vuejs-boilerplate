require('./bootstrap');

// Toastr
window.toastr = require('toastr');

// Vue
window.Vue = require('vue');

import {i18n} from 'ROOT/i18n';

import store from './store';

import router from './router';

const app = new Vue({
    el: '#app',
    i18n,
    store,
    router
});