var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');

var index = require('./routes/index');

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  map: { html: 'swig' }
}));

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
koa.use('/users', index.routes(), index.allowedMethods());

// mount root routes  
app.use(koa.routes());

app.on('error', function(err, ctx){
  log.error('server error', err, ctx);
});

module.exports = app;
