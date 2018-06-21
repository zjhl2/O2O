'use strict';

const router = require('koa-router')();
const DB = require('../lib/mysql');


//1.1 登录 DB
router.post('/signin', async (ctx) => {
    var data=ctx.request.body;
    var ans = await DB.findDataByUser(data.name);
    if (ans.length>0)
    {
        ctx.session.id=ans[0].user_id;
        console.log(`用户${data.name} 登录成功`);
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
    console.log(`用户id=${ctx.session.id} 登出成功`);
    ctx.session = null;
    ctx.body = {
        code:1
    }
})



//1.3 注册 DB
router.post('/register',async (ctx) => {
    var data=ctx.request.body;
    if (data.name && data.email && data.tel && data.password) {
        var ans = await DB.findDataByUser(data.name);
        if (ans.length) 
            ctx.body={
                code:2,
                err:"用户已存在"
            }
        else {
            ans = await DB.register(data);  
            console.log(`用户${data.name} 注册成功`);
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
    var prename=ans[0].name;
    ans[0].name=data.newname;
    ans = await DB.modifyData(ans[0]);
    console.log(`用户${prename} 修改用户名为${data.newname} 成功`);
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
    var name=ans[0].name;
    ans[0].tel=data.newtel;
    ans = await DB.modifyData(ans[0]);
    console.log(`用户${name} 修改号码为${data.newtel} 成功`);
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
    var name=ans[0].name;
    ans[0].email=data.newemail;
    ans = await DB.modifyData(ans[0]);
    console.log(`用户${name} 修改邮箱为${data.newemail} 成功`);
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
    var name=ans[0].name;
    ans[0].password=data.newpassword;
    ans = await DB.modifyData(ans[0]);
    console.log(`用户${name} 修改密码成功`);
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
    if (data.name && data.tel && data.address) {
        var ans = await DB.add_address(data);
        console.log(`用户id=${data.user_id} 添加地址成功`);
        ctx.body={
            code:1,
            err:""
        }
    }
    else {
        ctx.body={
            code:2,
            err:"请填写完整"
        }
    }
})

//删除地址 DB
router.post('/remove_address', async (ctx) => {
    var data = ctx.request.body;
    if (data.add_id){
        var ans = await DB.remove_address(data.add_id);
        console.log(ans);
        if (ans.affectedRows){
            console.log(`用户id=${data.user_id} 删除地址成功`);
            ctx.body = {
                "code":1,   //1 表示成功 ，2表示失败
                "err":''   //错误信息
            }
        }
        else 
            ctx.body={
                "code":2,   //1 表示成功 ，2表示失败
                "err":'地址不存在，请刷新页面'   //错误信息
            }
            
    }
    else 
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'地址编号不存在，后台出错，修改失败'   //错误信息
        }
        
})

//修改地址 DB  
router.post('/modify_address', async (ctx) => {
    var data = ctx.request.body;
    if (data.add_id && data.name && data.tel && data.address){
        var ans = await DB.modify_address(data);
        console.log(ans);
        if (ans.affectedRows){
            console.log(`地址id=${data.add_id} 修改成功`);
            ctx.body = {
                "code":1,   //1 表示成功 ，2表示失败
                "err":''   //错误信息
            }
        }
        else 
            ctx.body={
                "code":2,   //1 表示成功 ，2表示失败
                "err":'修改失败，请刷新页面，若依然有错请联系后台'   //错误信息
            }
    }
    else 
        ctx.body={
            "code":2,   //1 表示成功 ，2表示失败
            "err":'有信息为空，修改失败'   //错误信息
        }
})


//2.1 提交出售订单 DB
router.post('/submitorder', async (ctx) => {
    var data=ctx.request.body;
    if (data.date && data.addr_id && data.type && data.detail) {
        var ans = await DB.submitorder(data);
        console.log(`用户id=${ctx.session.id} 提交订单成功`);
        ctx.body={
            code:1,
            err:""
        }
    }
    else 
        ctx.body={
            code:0,
            err:"有信息为空，提交失败"
        }
})

//2.2
//获取待回收订单 DB
router.get('/getorders_recover', async (ctx) => {
    var ans=await DB.getorders_recover();
    var arr=[];
    for (let i=0;i<ans.length;i++)
        arr.push({
            order_id:ans[i].order_id,
            date:ans[i].date,
            name: ans[i].addr_name,//出售人姓名
            tel: ans[i].addr_tel, //出售人电话
            address: ans[i].addr_addr,  //地址
            type: ans[i].type,  //回收类型
            detail: ans[i].detail  //详细信息
        });
    ctx.body={
        orders:arr
    }
})

//2.3 接受订单 DB
router.post('/accept_order', async (ctx) => {
    var data=ctx.request.body;
    data.user_id2=ctx.session.id;
    var ans=await DB.findDataById(data.user_id2);
    data.name=ans[0].name;
    data.tel=ans[0].tel;
    if (data.order_id && data.name && data.tel) {  
        var ans=await DB.accept_order(data);
        ctx.body={
            code:1
        }
    }
    else 
        ctx.body={
            code:0,
            err:"有信息为空，提交失败"
        }
    

})

//2.4 获取与我相关的订单
router.get('/get_myorders', async (ctx) => {
    var id=ctx.session.id;
    var ans=await DB.get_myorders(id);
    var arr=[];
    for (let i=0;i<ans.length;i++)
    if (!ans[i].user_id2)
        arr.push({
            order_id: ans[i].order_id,
            date: ans[i].date,
            name: ans[i].addr_name,//出售人姓名
            tel: ans[i].addr_tel, //出售人电话
            address: ans[i].addr_addr,  //地址
            type: ans[i].type,  //回收类型
            detail: ans[i].detail,  //详细信息
            name2: ans[i].name2,  //回收人用户名
            tel2: ans[i].tel2, //回收人电话
            status:2  //未完成
        });
    for (let i=0;i<ans.length;i++)
    if (ans[i].user_id2)
        arr.push({
            order_id: ans[i].order_id,
            date: ans[i].date,
            name: ans[i].addr_name,//出售人姓名
            tel: ans[i].addr_tel, //出售人电话
            address: ans[i].addr_addr,  //地址
            type: ans[i].type,  //回收类型
            detail: ans[i].detail,  //详细信息
            name2: ans[i].name2,  //回收人用户名
            tel2: ans[i].tel2, //回收人电话
            status:1  //完成
        });
    ctx.body={
        orders:arr
    }
})

module.exports = router;