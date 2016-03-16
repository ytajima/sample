var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var _ = require('underscore');

var connection = mysql.createConnection({
    host     : 'localhost', //接続先ホスト
    user     : 'root',      //ユーザー名
    password : '',  //パスワード
    database : 'test_db',    //DB名
    port     : 3306 //ポート,デフォルトでも3306
});

router.get('/',function(request,response){
    var data=[];
    var sql = 'select * from test_table';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result.id);
        });

        response.writeHead(200,{
            'Content-Type':'application/json',
            'charset':'utf-8'
        });
        response.write(JSON.stringify(data),encoding='utf8');
        response.end();
    });
});

module.exports = router;
