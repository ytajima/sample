var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var async = require('async');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');

//////////////////////////////////////

var connection = mysql.createConnection({
    host     : 'localhost', //接続先ホスト
    user     : 'root',      //ユーザー名
    password : '',  //パスワード
    database : 'test_db',    //DB名
    port     : 3306 //ポート,デフォルトでも3306
});

var pr = function(params) {
    console.log(util.inspect(params, {depth: null, colors: true}));
};

//////////////////////////////////////

router.get('/getInfo',function(request,response){

    var data = {};
    data.result = true;
    data.data = {
        "information": "本日のお知らせ"
    };

    response.writeHead(200,{
        'Content-Type':'application/json',
        'charset':'utf-8'
    });
    response.write(JSON.stringify(data),encoding='utf8');
    response.end();
});

module.exports = router;
