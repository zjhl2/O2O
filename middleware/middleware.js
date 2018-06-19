'use strict';

module.exports = {
    checklogin : async (ctx, next) => {
        if (ctx.request.path === '/sell.html' ||
            ctx.request.path === '/recover.html' ||
            ctx.request.path === '/orders.html' ||
            ctx.request.path === '/orders.html' ||
            ctx.request.path === '/wallet.html' ||
            ctx.request.path === '/personal-center.html') {
            if (ctx.session.id) await next();
            else ctx.redirect('/login.html');
        }
        else await next();
    },
    welcome : async (ctx, next) => {
        if (ctx.request.path === '/login.html'){
            if (!ctx.session.id) await next();
            else {
                ctx.redirect('/loginSuccess.html');
            }
        }
        else await next();
    }
}