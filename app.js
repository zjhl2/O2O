'use strict';


const koa = require('koa');
const router = require('koa-router')();
const  serve = require("koa-static");

const app = new koa;

app.use(serve('./static'));

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// add router middleware:
app.use(router.routes());

router.get("/getusers", async (ctx, next) => {
    console.log(ctx);
    var arr=new Array();
    arr.push({name:"zy",type:"stu"});
    arr.push({name:"zjh",type:"stu"});
    console.log(arr.length);
    console.log(arr[0]);
    console.log(arr[1]);
    ctx.body=arr;
})

app.listen(3000);
console.log('app started at port 3000...');