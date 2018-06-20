'use strict';

const router = require('koa-router')();


//1.1 登录
router.post('/signin', async (ctx) => {
    var name=ctx.request.body.name;
    var password=ctx.request.body.password;
    console.log(name+ ' '+password);
    if ((name==="zjhl2"&&password==="zjhl2")||(name==="zy"&&password=="zy"))
    {
        ctx.session.id=name;
        ctx.body={
            code:1,
            err:''
        };
    }
    else 
    {
        ctx.body={
            code:0,
            err:"用户不存在"
        };
    }
})


//1.2 登出
router.get('/signout',async (ctx) => {
    ctx.session = null;
})



//1.3 注册
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
            code:1,
            err:''
        }
    }
})

//1.4.1
//获取昵称
router.get('/getname', async (ctx) => {
    ctx.body={
        name:ctx.session.id
    }
})

//修改昵称
router.post('/modifyname',async (ctx) => {
    ctx.body={
        "code":1,   //1 表示成功 ，2表示失败
        "err":''   //错误信息
    }
})

//1.4.2
//获取手机号
router.get('/gettel', async (ctx) => {
    ctx.body={
        tel:"110"
    }
})

//修改手机号
router.post('/modifytel', async (ctx) => {
    var newtel=ctx.request.body.newtel;
    if (newtel)
        ctx.body={
            "code":1,   //1 表示成功 ，2表示失败
            "err":''   //错误信息
        }
    else 
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'新号码为空，修改失败'   //错误信息
        }
})

//1.4.3
//获取邮箱
router.get('/getemail', async (ctx) => {
    ctx.body={
        email: "444@qq.com"
    }
})

//修改邮箱
router.post('/modifyemail', async (ctx) => {
    var newemail=ctx.request.body.newemail;
    if (newemail)
        ctx.body={
            "code":1,   //1 表示成功 ，2表示失败
            "err":''   //错误信息
        }
    else 
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'新邮箱为空，修改失败'   //错误信息
        }
})

//1.4.4 
//获取密码
router.get('/getpassword', async (ctx) => {
    ctx.body="zjhl2或者zy，只有你自己知道";
})

//修改密码
router.post('/modifypassword', async (ctx) => {
    var newpassword=ctx.request.body.newpassword;
    if (newpassword)
        ctx.body={
            "code":1,   //1 表示成功 ，2表示失败
            "err":''   //错误信息
        }
    else 
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'新密码为空，修改失败'   //错误信息
        }
})

//1.4.5
//获取地址
router.get('/getaddresses', async (ctx) => {
    var name = ctx.session.id;
    console.log(`${name} getaddresses`);
    var arr = [];
    arr.push({
        add_id:10000000,
        name:"郑先生",
        tel:"15968190000",
        address:"浙江省HDU 12号楼",
        default:0
    });
    arr.push({
        add_id:10000001,
        name:"朱先生",
        tel:"15968191111",
        address:"浙江省HDU 110号楼",
        default:0
    });
    ctx.body={
        addresses:arr
    }
})

//添加地址
router.post('/add_address', async (ctx) => {
    var data = ctx.request.body;
    console.log(data);
    if (data.name && data.tel && data.address)
        ctx.body = {
            "code":1,   //1 表示成功 ，2表示失败
            "err":''   //错误信息
        }
    else 
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'有信息为空，修改失败'   //错误信息
        }
        
})

//删除地址
router.post('/remove_address', async (ctx) => {
    var data = ctx.request.body;
    if (data.add_id)
        ctx.body = {
            "code":1,   //1 表示成功 ，2表示失败
            "err":''   //错误信息
        }
    else 
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'地址编号不存在，后台出错，修改失败'   //错误信息
        }
        
})

//修改地址
router.post('/modify_address', async (ctx) => {
    var data = ctx.request.body;
    if (data.add_id && data.name && data.tel && data.address)
        ctx.body = {
            "code":1,   //1 表示成功 ，2表示失败
            "err":''   //错误信息
        }
    else 
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'有信息为空，修改失败'   //错误信息
        }
})


//2.1 提交出售订单
router.post('/submitorder', async (ctx) => {
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

module.exports = router;