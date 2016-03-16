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
var data=[];
app.get('/',function(req,res){
        var sql = 'select * from test_table';
        var query = connection.query(sql);
        query
            .on('result',function(rows){
                data.push(rows);
            })
            .on('end',function(){
                res.writeHead(200,{
                    'Content-Type':'application/json',
                    'charset':'utf-8'
                });
                res.write(JSON.stringify(data),encoding='utf8');
                res.end();
            })
})

app.get('/test',function(req,res){
        var sql = 'select * from test_table';
        var query = connection.query(sql, function(error, resultList) {
            _.each(resultList, function(result) {
                data.push(result.id);
            });

            res.writeHead(200,{
                'Content-Type':'application/json',
                'charset':'utf-8'
            });
            res.write(JSON.stringify(data),encoding='utf8');
            res.end();
        });
})

app.listen(3000);

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
