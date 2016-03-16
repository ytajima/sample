var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost', //接続先ホスト
  user     : 'root',      //ユーザー名
  password : '',  //パスワード
  database : 'test_db',    //DB名
  port     : 3306 //ポート,デフォルトでも3306
});
app.get('/',function(request,response){
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

app.get('/test',function(request,response){
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

app.listen(80);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

module.exports = app;
