'use strict';


const koa = require('koa');
const router = require('koa-router')();
const session = require('koa-session');
const  serve = require("koa-static");
const bodyParser = require('koa-bodyparser');
const DB = require('./lib/mysql');
const midw = require('./middleware/middleware.js');

const app = new koa;

app.keys = ['keys'];
app.use(session(app));
app.use(bodyParser());

app.use(midw.checklogin);

app.use(midw.welcome);

app.use(serve('./static'));

app.use(router.routes());

//get
router.get("/getusers", async (ctx) => {
    ctx.body={name:"zy",type:"stu"};
})


//post
router.post('/signin', async (ctx) => {
    var name=ctx.request.body.name;
    var password=ctx.request.body.password;
    console.log(name+ ' '+password);
    if (name==="zjhl2"&&password==="zjhl2")
    {
        ctx.session.id=name;
        ctx.body={code:1};
    }
    else ctx.body={code:0};
})

router.post('/register',async (ctx) => {
    var
        name = ctx.request.body.Id || '',
        email = ctx.request.body["E-mail"] || '',
        tel = ctx.request.body["Phone-Number"] || '',
        password = ctx.request.body.Password || '';
    var res = await DB.findDataByUser(name);
    if (res.length!=0) {
        ctx.response.body = `<h1>Register failed! Id exists!</h1>
        <p><a href="/register.html">Try again</a></p>`;
    } else {
        await DB.insertData([name,password,email,tel]);
        console.log(`user ${name} registerd!`);
        ctx.response.body = `<h1>Register successd! </h1>
        <p><a href="/login.html">Go to login! </a></p>`;
    }
})

router.get('/signout',async (ctx) => {
    ctx.session = null;
    ctx.redirect('/login.html');
})

router.post('/submitorder', async (ctx, next) => {
    var 
        date=ctx.body["Date"];  //预约时间
        address=ctx.body["Address"]; //取货地址
        type=ctx.body["Type"]; //回收类型
        remark=ctx.body["Remark"];  //备注
    if (date && address && type) 
        ctx.body.code=1;
    else 
        ctx.body.code=0;
})


app.listen(3000);
console.log('app started at port 3000...');