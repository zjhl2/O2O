'use strict';

const router = require('koa-router')();
const DB = require('../lib/mysql');


//1.1 登录 DB
router.post('/signin', async (ctx) => {
    var data=ctx.request.body;
    console.log(data.name+ ' '+data.password);
    var ans = await DB.findDataByUser(data.name);
    if (ans.length>0)
    {
        ctx.session.id=ans[0].user_id;
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


//1.2 登出 DB
router.get('/signout',async (ctx) => {
    ctx.session = null;
    ctx.body = {
        code:1
    }
})



//1.3 注册 DB
router.post('/register',async (ctx) => {
    var data=ctx.request.body;
    if (data.name && data.email && data.tel && data.password) {
        var ans = await DB.register(data.name);
        if (ans.length) 
            ctx.body={
                code:2,
                err:"用户已存在"
            }
        else {
            ans = await DB.insertData(data);  
            //console.log(ans);
            ctx.body={
                code:1,
                err:""
            }
        }
    }
    else {
        ctx.body={
            code:2,
            err:'信息不完整'
        }
    }
})

//1.4.1
//获取昵称 DB
router.get('/getname', async (ctx) => {
    var ans = await DB.findDataById(ctx.session.id);
    ctx.body={
        name:ans[0].name
    }
})

//修改昵称 DB
router.post('/modifyname',async (ctx) => {
    var data=ctx.request.body;
    var ans = await DB.findDataById(ctx.session.id);
    if (ans[0].name===data.newname){
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'请输入新的用户名'   //错误信息
        }
        return;
    }
    var ans2 = await DB.findDataByUser(data.newname);
    if (ans2.length){
        console.log("用户名已存在，修改失败");
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'用户名已存在，修改失败'   //错误信息
        }
        return; 
    }
    ans[0].name=data.newname;
    ans = await DB.modifyData(ans[0]);
    ctx.body={
        "code":1,   //1 表示成功 ，2表示失败
        "err":''   //错误信息
    }
})

//1.4.2
//获取手机号 DB
router.get('/gettel', async (ctx) => {
    var ans = await DB.findDataById(ctx.session.id);
    ctx.body={
        tel:ans[0].tel
    }
})

//修改手机号 DB
router.post('/modifytel', async (ctx) => {
    var data=ctx.request.body;
    var ans = await DB.findDataById(ctx.session.id);
    if (ans[0].tel===data.newtel){
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'请输入新的号码'   //错误信息
        }
        return;
    }
    var ans2 = await DB.findDataByTel(data.newtel);
    if (ans2.length){
        console.log("号码已存在，修改失败");
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'号码已存在，修改失败'   //错误信息
        }
        return; 
    }
    ans[0].tel=data.newtel;
    ans = await DB.modifyData(ans[0]);
    ctx.body={
        "code":1,   //1 表示成功 ，2表示失败
        "err":''   //错误信息
    }
})

//1.4.3
//获取邮箱 DB
router.get('/getemail', async (ctx) => {
    var ans = await DB.findDataById(ctx.session.id);
    ctx.body={
        email:ans[0].email
    }
})

//修改邮箱 DB
router.post('/modifyemail', async (ctx) => {
    var data=ctx.request.body;
    var ans = await DB.findDataById(ctx.session.id);
    if (ans[0].tel===data.newemail){
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'请输入新的号码'   //错误信息
        }
        return;
    }
    var ans2 = await DB.findDataByEmail(data.newemail);
    if (ans2.length){
        console.log("email已存在，修改失败");
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'email已存在，修改失败'   //错误信息
        }
        return; 
    }
    ans[0].email=data.newemail;
    ans = await DB.modifyData(ans[0]);
    ctx.body={
        "code":1,   //1 表示成功 ，2表示失败
        "err":''   //错误信息
    }
})

//1.4.4 
//获取密码
router.get('/getpassword', async (ctx) => {
    ctx.body="只有你自己知道";
})

//修改密码 DB
router.post('/modifypassword', async (ctx) => {
    var data=ctx.request.body;
    var ans = await DB.findDataById(ctx.session.id);
    ans[0].password=data.newpassword;
    ans = await DB.modifyData(ans[0]);
    ctx.body={
        "code":1,   //1 表示成功 ，2表示失败
        "err":''   //错误信息
    }
})

//1.4.5
//获取地址 DB
router.get('/getaddresses', async (ctx) => {
    var ans = await DB.get_address(ctx.session.id);
    var arr = [];
    for (let i=0;i<ans.length;i++)
        arr.push({
            add_id:ans[i].addr_id,
            name:ans[i].addr_name,
            tel:ans[i].addr_tel,
            address:ans[i].addr_addr
        });
    ctx.body={
        addresses:arr
    }
})

//添加地址 DB
router.post('/add_address', async (ctx) => {
    var data = ctx.request.body;
    data.user_id = ctx.session.id;
    var ans = await DB.add_address(data);
    ctx.body={
        code:1,
        err:""
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
    var data=ctx.request.body;
    if (data.date && data.addr_id && data.type && data.detail) 
        ctx.body={
            code:1,
            err:""
        }
    else 
        ctx.body={
            code:0,
            err:"有信息为空，提交失败"
        }
})

//2.2
//获取待回收订单
router.get('/getorders_recover', async (ctx) => {
    var arr=[];
    arr.push({
        order_id:10000,
        date:"2018-05-30 12:30",
        name: "朱先生",//出售人姓名
        tel: "15968191111", //出售人电话
        address: "浙江省HDU 110号楼",  //地址
        type:["废纸","电子废品"],  //回收类型
        detail:"废书两本，废旧电池三对"  //详细信息
    });
    arr.push({
        order_id:10001,
        date:"2018-06-30 15:20",
        name: "郑雨先生",//出售人姓名
        tel: "15960000", //出售人电话
        address: "浙江省HDU 119号楼",  //地址
        type:["废旧衣物","电子废品"],  //回收类型
        detail:"废衣服一百件，废旧电池一百对"  //详细信息
    });
    ctx.body={
        orders:arr
    }
})

//2.3 接受订单
router.post('/accept_order', async (ctx) => {
    var data=ctx.body;
    if (data.order_id && data.tel)        
        ctx.body={
            code:1
        }
    else 
        ctx.body={
            code:0,
            err:"有信息为空，提交失败"
        }
    

})

//2.4 获取与我相关的订单
router.get('/get_myorders', async (ctx) => {
    var arr=[];
    arr.push({
        order_id:10000,
        date:"2018-05-30 12:30",
        name: "朱先生",//出售人姓名
        tel: "15968191111", //出售人电话
        address: "浙江省HDU 110号楼",  //地址
        type:["废纸","电子废品"],  //回收类型
        detail:"废书两本，废旧电池三对",  //详细信息
        name2:"zy",  //回收人用户名
        tel2:"110", //回收人电话
        status:1  //完成

    });
    arr.push({
        order_id:10001,
        date:"2018-06-30 15:20",
        name: "郑先生",//出售人姓名
        tel: "15960000", //出售人电话
        address: "浙江省HDU 119号楼",  //地址
        type:["废旧衣物","电子废品"],  //回收类型
        detail:"废衣服一百件，废旧电池一百对",  //详细信息
        name2:"zjhl2",  //回收人用户名
        tel2:"119", //回收人电话
        status:2  //未完成
    });
    ctx.body={
        orders:arr
    }
})

module.exports = router;