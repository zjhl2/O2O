'use strict';


const Koa = require('koa');

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

const app = new Koa();

const  serve = require("koa-static");
app.use(serve('./static'));

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});


// add router middleware:
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');