'use strict';


const koa = require('koa');
const router = require('koa-router')();
const session = require('koa-session');
const  serve = require("koa-static");
const bodyParser = require('koa-bodyparser');
var DB = require('./mysql.js');

const app = new koa;

app.keys = ['keys'];
app.use(session(app));
app.use(bodyParser());

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

app.use(async (ctx, next) => {
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
});

app.use(async (ctx, next) => {
    if (ctx.request.path === '/login.html'){
        if (!ctx.session.id) await next();
        else {
            var name = ctx.session.id;
            ctx.response.body = `<h1>Welcome, ${name}!</h1>
            <p><a href="/index.html">Go to home.</a></p>`;
        }
    }
    else await next();
});

app.use(serve('./static'));

app.use(router.routes());

//get
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

//post
router.post('/signin', async (ctx) => {
    var
        name = ctx.request.body.Id || '',
        password = ctx.request.body.Password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    var res = await DB.findDataByUser(name);
    if (!res) {
        ctx.response.body = `<h1>Login failed! No such user!</h1>
        <p><a href="/login.html">Try again</a></p>`;
    }
    else if (res[0].password === password) {
        ctx.session.id = name;
        ctx.response.body = `<h1>Welcome, ${name}!</h1>
        <p><a href="/index.html">Go to home.</a></p>`;
        console.log(`${name} signin success`);
    } 
    else {
        ctx.response.body = `<h1>Login failed! Wrong password!</h1>
        <p><a href="/login.html">Try again</a></p>`;
    }
});

router.get('/signout',async (ctx) => {
    ctx.session = null;
    ctx.redirect('/login.html');
})
app.listen(3000);
console.log('app started at port 3000...');