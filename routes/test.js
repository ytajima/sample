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

router.get('/',function(request,response){
    var data=[];
    var sql = 'select * from test_table';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result.id + "test");
        });

        response.writeHead(200,{
            'Content-Type':'application/json',
            'charset':'utf-8'
        });
        response.write(JSON.stringify(data),encoding='utf8');
        response.end();
    });
});

router.get('/db',function(request, response, callback){
    var data=[];
    var sql = 'select * from test_table';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });

        var dataFirst = _.first(data);

        async.waterfall([
            function(callback) {
                var sql2 = 'select * from test_table where id =' + dataFirst.id;
                console.log(sql2);
                var query2 = connection.query(sql2, function(error, resultList) {
                    _.each(resultList, function(result) {
                        data.push(result);
                    });

                    callback();
                });
            },
            function(callback) {
                response.writeHead(200,{
                    'Content-Type':'application/json',
                    'charset':'utf-8'
                });
                response.write(JSON.stringify(data),encoding='utf8');
                response.end();
            }
        ], callback);
    });
});

router.get('/json',function(request, response, callback){
    var data=[];
    var resultList = JSON.parse(fs.readFileSync('./resource/master/test.json', 'utf8'));

    _.each(resultList, function(result) {
        data.push(result);
    });

    var dataFirst = _.first(data);

    async.waterfall([
        function(callback) {
            var sql2 = 'select * from test_table where id =' + dataFirst.id;
            console.log(sql2);
            var query2 = connection.query(sql2, function(error, resultList) {
                _.each(resultList, function(result) {
                    data.push(result);
                });

                callback();
            });
        },
        function(callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });
            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

module.exports = router;
