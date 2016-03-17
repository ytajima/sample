var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var mysql = require('mysql');

//////////////////////////////////////

var connection = mysql.createConnection({
    host     : 'localhost', //接続先ホスト
    user     : 'tqdbuser',      //ユーザー名
    password : 'hoge',  //パスワード
    database : 'tquest',    //DB名
    port     : 3306 //ポート,デフォルトでも3306
});

var pr = function(params) {
    console.log(util.inspect(params, {depth: null, colors: true}));
};

//////////////////////////////////////

router.get('/getInfo',function(request,response){
    var data = {};
    data.result = true;
    data.data = [
        {
            "information": "本日のお知らせ"
        }
    ];

    response.writeHead(200,{
        'Content-Type':'application/json',
        'charset':'utf-8'
    });
    response.write(JSON.stringify(data),encoding='utf8');
    response.end();
});

router.get('/readPlayer',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(readPlayer, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = readPlayer;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/readMap',function(request, response, callback){
    var targetMapId = request.param('targetMapId');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getReadMapByMapId(request, targetMapId, callback);
        },
        function(readPlayer, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = readPlayer;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});























router.get('/db',function(request, response, callback){
    var data = {};
    async.waterfall([
        function(callback) {
            getItemAll(request, callback);
        },
        function(itemList, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });
            response.write(JSON.stringify(itemList),encoding='utf8');
            response.end();
        }
    ], callback);
});



































///////////////////////////////////////////////////////
var getItemAll = function(request, callback)  {
    var data = [];
    var sql = 'select * from item';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var getReadPlayerByPlayerId = function(request, playerId, callback)  {
    var data = [];
    var sql = 'select * from player where playerId = "' + playerId + '"';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var getReadMapByMapId = function(request, mapId, callback)  {
    var data = [];
    var sql = 'select * from map where mapId = "' + mapId + '"';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};


module.exports = router;
