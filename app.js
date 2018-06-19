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
router.get("/getname", async (ctx) => {
    ctx.body=ctx.session.id;
})


//post
router.post('/signin', async (ctx) => {
    var name=ctx.request.body.name;
    var password=ctx.request.body.password;
    console.log(name+ ' '+password);
    if ((name==="zjhl2"&&password==="zjhl2")||(name==="zy"&&password=="zy"))
    {
        ctx.session.id=name;
        ctx.body={code:1};
    }
    else 
    {
        ctx.body=
        {
            code:0,
            err:"用户不存在"
        };
    }
})

router.post('/register',async (ctx) => {
    var
        name = ctx.request.body.name,
        email = ctx.request.body.email,
        tel = ctx.request.body.tel,
        password = ctx.request.body.password ;
    //var res = await DB.findDataByUser(name);
    if (!name || !email ||!tel || ! password) {
        ctx.body={
            code:2,
            err:"信息不全"
        }
    }
    else {
        ctx.body={
            code:1
        }
    }
})

router.get('/signout',async (ctx) => {
    ctx.session = null;
})

router.post('/submitorder', async (ctx, next) => {
    var 
        date=ctx.request.body.date||'',  //预约时间
        address=ctx.request.body.address||'', //取货地址
        type=ctx.request.body.type||'', //回收类型
        remark=ctx.request.body.remark||'';  //备注
    if (date && address && type) 
        ctx.body={
            code:1
        };
    else 
        ctx.body={
            code:0
        }
})


app.listen(3000);
console.log('app started at port 3000...');