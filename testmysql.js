'use strict';

var DB = require('./mysql.js');

(async () => {
    var ans = await DB.findDataByUser('zjhl2');
    if (ans.length==0) console.log('no user');
    else console.log(ans[0].password);
})();