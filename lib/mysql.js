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

//注册
exports.register = ( data ) => {
    let _sql = `insert into user set name="${data.name}",password="${data.password}",tel="${data.tel}",email="${data.email}"`;
    return query( _sql);
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

//通过email查找
exports.findDataByEmail =  ( email ) => {
    let _sql = `select * from user where email="${email}"` ;
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

exports.add_address= ( data ) => {
    let _sql = `insert into addr 
                set user_id="${data.user_id}",
                    addr_name="${data.name}",
                    addr_tel="${data.tel}",
                    addr_addr="${data.address}"`;
    return query( _sql);
}

exports.get_address= ( user_id ) => {
    let _sql = `select * from addr
                where user_id="${user_id}"`;
    return query( _sql);
}

exports.modify_address= ( data ) => {
    let _sql = `update addr
                set addr_name="${data.name}",
                    addr_tel="${data.tel}",
                    addr_addr="${data.address}"
                where addr_id="${data.add_id}"` ;
    return query( _sql);
}

exports.remove_address= ( addr_id ) => {
    let _sql = `delete from addr
                where addr_id="${addr_id}"`;
    return query( _sql);
}