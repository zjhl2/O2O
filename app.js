'use strict';


const koa = require('koa');
const router = require('./router/router.js');
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

app.listen(3000);
console.log('app started at port 3000...');