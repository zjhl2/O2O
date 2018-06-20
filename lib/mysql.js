'use strict';

var  mysql = require('mysql');
var config = require('../config/default.js');

var pool = mysql.createPool({
    host        :   config.database.HOST,
    user        :   config.database.USERNAME,
    password    :   config.database.PASSWORD,
    database    :   config.database.DATABASE,
    port        :   config.database.PORT
});

let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }
            else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                    connection.release();
                })
            }
        })
    })
}

//通过name查找
exports.findDataByUser =  ( name ) => {
    let _sql = `select * from user where name="${name}"` ;
    return query( _sql);
}

//通过tel查找
exports.findDataByTel =  ( tel ) => {
    let _sql = `select * from user where tel="${tel}"` ;
    return query( _sql);
}
//通过id查找
exports.findDataById=  ( id ) => {
    let _sql = `select * from user where user_id="${id}"` ;
    return query( _sql);
}

//通过id修改信息
exports.modifyData=  ( data ) => {
    let _sql = `update user 
                set name="${data.name}",
                    tel="${data.tel}",
                    password="${data.password}",
                    email="${data.email}"
                where user_id="${data.user_id}"` ;
    return query( _sql);
}

//注册
exports.insertData = ( data ) => {
    let _sql = `insert into user set name="${data.name}",password="${data.password}",tel="${data.tel}",email="${data.email}"`;
    return query( _sql);
}
