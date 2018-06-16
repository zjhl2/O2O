'use strict';


const koa = require('koa');
const router = require('koa-router')();
const session = require('koa-session');
const  serve = require("koa-static");
const bodyParser = require('koa-bodyparser');

const app = new koa;

app.keys = ['keys'];
app.use(session(app));
app.use(bodyParser());

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
/*
app.use(ctx => {
    if (ctx.path === '/favicon.ico') return;
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    ctx.body = n + ' views';
});
*/
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
router.get('/test', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <div>
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
            </div>
        </form>`;
});
//post
router.post('/signin', async (ctx, next) => {
    var
        name = ctx.request.body.Id || '',
        password = ctx.request.body.Password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

app.listen(3000);
console.log('app started at port 3000...');