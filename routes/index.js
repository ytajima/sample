var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var mysql = require('mysql');
var mysql = require('mysql');
var qs = require('qs');
require('date-utils');

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
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

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
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/readItem',function(request, response, callback){
    var targetItemId = request.param('targetItemId');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getReadItemByItemId(request, targetItemId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/findItemOwner',function(request, response, callback){
    var targetItemId = request.param('targetItemId');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            findItemOwner(request, targetItemId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updatePlayer',function(request, response, callback){

    var targetPlayerId = request.param('targetPlayerId');

    var newPlayerHp = request.param('newPlayerHp');
    var newPlayerMp = request.param('newPlayerMp');
    var newPlayerExp = request.param('newPlayerExp');
    var newPlayerAtk = request.param('newPlayerAtk');
    var newPlayerDef = request.param('newPlayerDef');
    var newPlayerInt = request.param('newPlayerInt');
    var newPlayerAgi = request.param('newPlayerAgi');
    var newPlayerItems = request.param('newPlayerItems');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updatePlayerByPlayerId(request, {
                targetPlayerId: targetPlayerId,
                newPlayerHp:    newPlayerHp,
                newPlayerMp:    newPlayerMp,
                newPlayerExp:   newPlayerExp,
                newPlayerAtk:   newPlayerAtk,
                newPlayerDef:   newPlayerDef,
                newPlayerInt:   newPlayerInt,
                newPlayerAgi:   newPlayerAgi,
                newPlayerItems: newPlayerItems
            }, callback);
        },
        function(callback) {
            // ログ ///////////////////
            var urlPath = request.url.split("?");
            var apiPath = urlPath[0].replace("/","");
            var apiParam = JSON.stringify(qs.parse(urlPath[1]));
            var dt = new Date();
            var logDateTime = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
            var logParam = {
                apiPath: apiPath,
                apiParam: apiParam,
                logDateTime: logDateTime
            };
            /////////////////////
            logParam.playerId = targetPlayerId;
            insertPlayerLog(request, logParam, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updateMap',function(request, response, callback){
    var targetMapId = request.param('targetMapId');

    var newMapItems = request.param('newMapItems');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updateMapByMapId(request, {
                targetMapId: targetMapId,
                newMapItems: newMapItems
            }, callback);
        },
        function(callback) {
            getReadMapByMapId(request, targetMapId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updateItem',function(request, response, callback){
    var targetItemId = request.param('targetItemId');

    var newItemValue = request.param('newItemValue');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updateItemByItemId(request, {
                targetItemId: targetItemId,
                newItemValue:    newItemValue
            }, callback);
        },
        function(callback) {
            // ログ ///////////////////
            var urlPath = request.url.split("?");
            var apiPath = urlPath[0].replace("/","");
            var apiParam = JSON.stringify(qs.parse(urlPath[1]));
            var dt = new Date();
            var logDateTime = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
            var logParam = {
                apiPath: apiPath,
                apiParam: apiParam,
                logDateTime: logDateTime
            };
            /////////////////////
            logParam.itemId = targetItemId;
            insertItemLog(request, logParam, callback);
        },
        function(callback) {
            getReadItemByItemId(request, targetItemId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/switchItemOwner',function(request, response, callback){
    var targetItemId = request.param('targetItemId');

    var newItemOwner = request.param('newItemOwner');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getReadPlayerByPlayerId(request, newItemOwner, callback);
        },
        function(itemOwner, callback) {
            switchItemOwner(request, {
                targetItemId: targetItemId,
                newItemOwner:    newItemOwner,
                baseItemOwnerItems: itemOwner[0].playerItems
            }, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, newItemOwner, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updatePlayerHp',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var calcValue = request.param('calcValue');

    calcValue = Number(calcValue);
    if(calcValue > 0) {
        calcValue = "+" + calcValue;
    }
    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updatePlayerValueByPlayerId(request, {
                targetPlayerId: targetPlayerId,
                playerHpCalcValue: calcValue
            }, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updatePlayerMp',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var calcValue = request.param('calcValue');

    calcValue = Number(calcValue);
    if(calcValue > 0) {
        calcValue = "+" + calcValue;
    }
    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updatePlayerValueByPlayerId(request, {
                targetPlayerId: targetPlayerId,
                playerMpCalcValue: calcValue
            }, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updatePlayerExp',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var calcValue = request.param('calcValue');

    calcValue = Number(calcValue);
    if(calcValue > 0) {
        calcValue = "+" + calcValue;
    }
    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updatePlayerValueByPlayerId(request, {
                targetPlayerId: targetPlayerId,
                playerExpCalcValue: calcValue
            }, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updatePlayerAtk',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var calcValue = request.param('calcValue');

    calcValue = Number(calcValue);
    if(calcValue > 0) {
        calcValue = "+" + calcValue;
    }
    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updatePlayerValueByPlayerId(request, {
                targetPlayerId: targetPlayerId,
                playerAtkCalcValue: calcValue
            }, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updatePlayerDef',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var calcValue = request.param('calcValue');

    calcValue = Number(calcValue);
    if(calcValue > 0) {
        calcValue = "+" + calcValue;
    }
    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updatePlayerValueByPlayerId(request, {
                targetPlayerId: targetPlayerId,
                playerDefCalcValue: calcValue
            }, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updatePlayerInt',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var calcValue = request.param('calcValue');

    calcValue = Number(calcValue);
    if(calcValue > 0) {
        calcValue = "+" + calcValue;
    }
    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updatePlayerValueByPlayerId(request, {
                targetPlayerId: targetPlayerId,
                playerIntCalcValue: calcValue
            }, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/updatePlayerAgi',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var calcValue = request.param('calcValue');

    calcValue = Number(calcValue);
    if(calcValue > 0) {
        calcValue = "+" + calcValue;
    }
    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            updatePlayerValueByPlayerId(request, {
                targetPlayerId: targetPlayerId,
                playerAgiCalcValue: calcValue
            }, callback);
        },
        function(callback) {
            getReadPlayerByPlayerId(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankPlayerHp',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getRankPlayer(request, {
                sortColumn: "playerHp",
                isAscend: isAscend
            }, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankPlayerMp',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getRankPlayer(request, {
                sortColumn: "playerMp",
                isAscend: isAscend
            }, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankPlayerExp',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getRankPlayer(request, {
                sortColumn: "playerExp",
                isAscend: isAscend
            }, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankPlayerAtk',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getRankPlayer(request, {
                sortColumn: "playerAtk",
                isAscend: isAscend
            }, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankPlayerDef',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getRankPlayer(request, {
                sortColumn: "playerDef",
                isAscend: isAscend
            }, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankPlayerInt',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getRankPlayer(request, {
                sortColumn: "playerInt",
                isAscend: isAscend
            }, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankPlayerAgi',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getRankPlayer(request, {
                sortColumn: "playerAgi",
                isAscend: isAscend
            }, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankItemValue',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getRankItem(request, {
                sortColumn: "itemValue",
                isAscend: isAscend
            }, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/listPlayerOnMap',function(request, response, callback){
    var targetMapId = request.param('targetMapId');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getPlayerByMapId(request, targetMapId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/getPlayerLog',function(request, response, callback){
    var targetPlayerId = request.param('targetPlayerId');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getPlayerLog(request, targetPlayerId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });
            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/getItemLog',function(request, response, callback){
    var targetItemId = request.param('targetItemId');

    var data = {};

    data.result = true;
    async.waterfall([
        function(callback) {
            getItemLog(request, targetItemId, callback);
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = result;

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/rankPlayerByItemValue',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;

    var playerData = [];
    async.waterfall([
        function(callback) {
            getAllPlayer(request, callback);
        },
        function(playerList, callback) {
            playerData = playerList;
            async.each(playerData, function(player, callback) {
                player.playerItemsList = player.playerItems.split(",");
                player.sumItemValue = 0;

                async.each(player.playerItemsList, function(item, callback) {
                    getReadItemByItemId(request, item, function(error, itemData) {
                        player.sumItemValue += itemData[0].itemValue;
                        callback();
                    });
                }, callback);
            }, callback);
        },
        function(callback) {
            // sumItemValue でソート
            if(isAscend == "true") {
                playerData = _.sortBy(playerData, function(p) { return p.sumItemValue });
            } else {
                playerData = _.sortBy(playerData, function(p) { return -p.sumItemValue });
            }
            callback();
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = _.first(playerData,20);

            // データ生成で使用した不要要素を削除
            _.each(data.data, function(data) {
                delete(data.sumItemValue);
                delete(data.playerItemsList);
            });

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/challenge3',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;

    var playerData = [];
    async.waterfall([
        function(callback) {
            getAllPlayer(request, callback);
        },
        function(playerList, callback) {
            playerData = playerList;
            async.each(playerData, function(player, callback) {
                player.strong = (player.playerHp + player.playerMp) * ((player.playerAtk * player.playerHp) + (player.playerInt * player.playerMp)) * player.playerDef * player.playerAgi;
                callback();
            }, callback);
        },
        function(callback) {
            // strong でソート
            if(isAscend == "true") {
                playerData = _.sortBy(playerData, function(p) { return p.strong });
            } else {
                playerData = _.sortBy(playerData, function(p) { return -p.strong });
            }
            callback();
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = _.first(playerData,20);

            // データ生成で使用した不要要素を削除
            _.each(data.data, function(data) {
                delete(data.strong);
            });

            response.write(JSON.stringify(data),encoding='utf8');
            response.end();
        }
    ], callback);
});

router.get('/challenge1',function(request, response, callback){
    var isAscend = request.param('isAscend');

    var data = {};

    data.result = true;

    var playerData = [];
    async.waterfall([
        function(callback) {
            getAllPlayer(request, callback);
        },
        function(playerList, callback) {
            playerData = playerList;
            async.each(playerData, function(player, callback) {
                player.strong = (player.playerHp + player.playerMp) * ((player.playerAtk * player.playerHp) + (player.playerInt * player.playerMp)) * player.playerDef * player.playerAgi;
                callback();
            }, callback);
        },
        function(callback) {
            // strong でソート
            if(isAscend == "true") {
                playerData = _.sortBy(playerData, function(p) { return p.strong });
            } else {
                playerData = _.sortBy(playerData, function(p) { return -p.strong });
            }
            callback();
        },
        function(result, callback) {
            response.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });

            data.data = _.first(playerData,20);

            // データ生成で使用した不要要素を削除
            _.each(data.data, function(data) {
                delete(data.strong);
            });

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

var getAllPlayer = function(request, callback)  {
    var data = [];
    var sql = 'select * from player';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var getAllPlayerLimit = function(request, callback)  {
    var data = [];
    var sql = 'select * from player limit 10';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var getPlayerByMapId = function(request, mapId, callback)  {
    var data = [];
    var sql = 'select * from player where playerMap = "' + mapId + '"';
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

var getReadItemByItemId = function(request, itemId, callback)  {
    var data = [];
    var sql = 'select * from item where itemId = "' + itemId + '"';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var findItemOwner = function(request, itemId, callback)  {
    var data = [];
    var sql = 'select * from player where playerItems LIKE "%' + itemId + '%"';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var updatePlayerByPlayerId = function(request, params, callback)  {
    var data = [];
    var updateSql = "";
    if(params.newPlayerHp) { updateSql += "playerHp = " + params.newPlayerHp };
    if(params.newPlayerMp) { updateSql += "playerMp = " + params.newPlayerMp };
    if(params.newPlayerExp) { updateSql += "playerExp = " + params.newPlayerExp };
    if(params.newPlayerAtk) { updateSql += "playerAtk= " + params.newPlayerAtk };
    if(params.newPlayerDef) { updateSql += "playerDef = " + params.newPlayerDef };
    if(params.newPlayerInt) { updateSql += "playerInt = " + params.newPlayerInt };
    if(params.newPlayerAgi) { updateSql += "playerAgi = " + params.newPlayerAgi };
    if(params.newPlayerItems) { updateSql += "playerItems = '" + params.newPlayerItems + "'"};

    var sql = 'update player set '
        + updateSql
        + ' where playerId = ' + '"' + params.targetPlayerId + '"';
    var query = connection.query(sql, function(error, resultList) {
        callback();
    });
};

var updateMapByMapId = function(request, params, callback)  {
    var data = [];
    var updateSql = "";
    if(params.newMapItems) { updateSql += "mapItems = '" + params.newMapItems + "'"};

    var sql = 'update map set '
        + updateSql
        + ' where mapId = ' + '"' + params.targetMapId + '"';
    var query = connection.query(sql, function(error, resultList) {
        callback();
    });
};

var updateItemByItemId = function(request, params, callback)  {
    var data = [];
    var updateSql = "";
    if(params.newItemValue) { updateSql += "itemValue = " + params.newItemValue };

    var sql = 'update item set '
        + updateSql
        + ' where itemId = ' + '"' + params.targetItemId + '"';
    var query = connection.query(sql, function(error, resultList) {
        callback();
    });
};

var switchItemOwner = function(request, params, callback)  {
    var data = [];
    var updateSql = "";
    if(params.baseItemOwnerItems) {
        updateSql += 'playerItems = "' + params.baseItemOwnerItems + ',' + params.targetItemId + '"';
    } else {
        updateSql += 'playerItems = "' + params.targetItemId + '"';
    }

    var sql = 'update player set '
        + updateSql
        + ' where playerId = "' + params.newItemOwner + '"';
    var query = connection.query(sql, function(error, resultList) {
        callback();
    });
};

var updatePlayerValueByPlayerId = function(request, params, callback)  {
    var data = [];
    var updateSql = "";

    if(params.playerHpCalcValue) { updateSql += "playerHp = playerHp " + params.playerHpCalcValue };
    if(params.playerMpCalcValue) { updateSql += "playerMp = playerMp " + params.playerMpCalcValue };
    if(params.playerExpCalcValue) { updateSql += "playerExp = playerExp " + params.playerExpCalcValue };
    if(params.playerAtkCalcValue) { updateSql += "playerAtk = playerAtk " + params.playerAtkCalcValue };
    if(params.playerDefCalcValue) { updateSql += "playerDef = playerDef " + params.playerDefCalcValue };
    if(params.playerIntCalcValue) { updateSql += "playerInt = playerInt " + params.playerIntCalcValue };
    if(params.playerAgiCalcValue) { updateSql += "playerAgi = playerAgi " + params.playerAgiCalcValue };

    var sql = 'update player set '
        + updateSql
        + ' where playerId = ' + '"' + params.targetPlayerId + '"';
    var query = connection.query(sql, function(error, resultList) {
        callback();
    });
};

var getRankPlayer = function(request, params, callback)  {
    var data = [];

    var sortColumn = params.sortColumn;
    var sortOrder = "asc";
    if(params.isAscend == "false") {
        sortOrder = "desc";
    }

    var sql = 'select * from player order by ' + sortColumn + ' ' + sortOrder + ' limit 20';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var getRankItem = function(request, params, callback)  {
    var data = [];

    var sortColumn = params.sortColumn;
    var sortOrder = "asc";
    if(params.isAscend == "false") {
        sortOrder = "desc";
    }

    var sql = 'select * from item order by ' + sortColumn + ' ' + sortOrder + ' limit 20';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var insertPlayerLog = function(request, params, callback)  {
    var data = [];
    var sql = 'insert into playerLog ('
    + 'playerId, '
    + 'apiPath, '
    + 'apiParam, '
    + 'logDateTime'
    + ') values ( '
    + '"' + params.playerId + '",'
    + '"' + params.apiPath + '",'
    + '"?",'
    + '"' + params.logDateTime + '"'
    + ') ';
    var query = connection.query(sql, [params.apiParam], function(err, resultList) {
        callback();
    });
};


var insertItemLog = function(request, params, callback)  {
    var data = [];
    var sql = 'insert into itemLog ('
        + 'itemId , '
        + 'apiPath , '
        + 'apiParam , '
        + 'logDateTime'
        + ') values ( '
        + '"' + params.itemId + '",'
        + '"' + params.apiPath + '",'
        + '"?",'
        + '"' + params.logDateTime + '"'
        + ') ';
    var query = connection.query(sql, [params.apiParam], function(err, resultList) {
        callback();
    });
};

var getPlayerLog = function(request, playerId, callback)  {
    var data = [];
    var sql = 'select * from playerLog where playerId = "' + playerId + '" order by logDatetime desc limit 20';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};

var getItemLog = function(request, itemId, callback)  {
    var data = [];
    var sql = 'select * from itemLog where itemId = "' + itemId + '" order by logDatetime desc limit 20';
    var query = connection.query(sql, function(error, resultList) {
        _.each(resultList, function(result) {
            data.push(result);
        });
        callback(null, data);
    });
};




module.exports = router;
