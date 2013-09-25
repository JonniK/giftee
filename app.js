
/**
 * Module dependencies.
 */

var express = require('express');
//var everyauth = require('everyauth');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var log  = require('./libs/log')(module);
var config = require('./libs/config');
var mongoose = require('./libs/mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || config.get('port'))
    .set('views', __dirname + '/views')
    .set('view engine', 'jade')
    .use(express.favicon())
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(express.cookieParser('no man curse'))
    .use(express.session())
//    .use(everyauth.middleware(app))
    .use(app.router)
    .use(require('less-middleware')({ src: __dirname + '/public' }))
    .use(express.static(path.join(__dirname, 'public')))
    .use(function(req, res, next){
        res.status(404);
        log.debug('Not found URL: %s',req.url);
        res.send({ error: 'Not found' });
        return;
    })
    .use(function(err, req, res, next){
        res.status(err.status || 500);
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ error: err.message });
        return;
    });

//everyauth.helpExpress(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
