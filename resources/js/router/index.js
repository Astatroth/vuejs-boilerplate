import VueRouter from 'vue-router';
import Vue from 'vue';
import store from 'ROOT/store';
import {loadLanguageAsync} from 'ROOT/i18n';

Vue.use(VueRouter);

let children = [
    // Predefined child routes
    // Example:
    /*{
        path: '',
        name: 'dashboard',
        component: () => import(/!* webpackChunkName: 'dashboard-index' *!/ 'ROOT/Store/modules/Dashboard/dashboard'),
        meta: {
            title: 'Dashboard',
            middleware: [auth, subscribed]
        }
    }*/
];
let routes = [];

let requireRoutes = require.context('./../store/modules/', true, /routes\.js$/i);
requireRoutes.keys().forEach(key => {
    const _routes = requireRoutes(key).default;
    _routes.forEach((route) => {
        if (route.meta.layout !== 'child') {
            children.push(route);
        } else {
            routes.push(route);
        }
    });
});

routes.push({
    path: '/',
    component: () => import(/* webpackChunkName: 'home' */ 'ROOT/store/modules/Home/index'),
    children: children,
    meta: {
        module: 'Home'
    }
});

routes.push({
    path: '*',
    component: () => import(/* webpackChunkName: 'not-found' */ 'ROOT/store/modules/NotFound/index'),
    meta: {
        title: 'Page Not Found'
    }
});

const router = new VueRouter({
    hash: false,
    mode: 'history',
    routes
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        // Run the default Vue Router `next()` callback first.
        context.next(...parameters);
        // Than run the subsequent Middleware with a new
        // `nextMiddleware()` callback.
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];
        const permissions = to.meta.permissions
            ? (Array.isArray(to.meta.permissions) ? to.meta.permissions : [to.meta.permissions])
            : null;
        const context = {
            from,
            next,
            router,
            to,
            permissions
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        return middleware[0]({ ...context, next: nextMiddleware });
    }

    return next();
});

/**
 * Manage page title
 */

router.beforeEach((to, from, next) => {
    const module = to.meta.module || null;

    if (!module) {
        return next();
    }

    loadLanguageAsync(module).then(() => next());
});

router.afterEach((to, from) => {
    //
});

export default router;