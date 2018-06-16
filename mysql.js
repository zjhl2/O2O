'use strict';

var  mysql = require('mysql');
var config = require('./config/default.js');

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

exports.findDataByUser =  ( nickname ) => {
    let _sql = `select * from user where nickname="${nickname}";` ;
    return query( _sql);
}
