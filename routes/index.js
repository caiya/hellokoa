var router = require('koa-router')();
var dbHelper = require("../utils/dbHelper");

router.get('/', function *(next) {

    //var data = dbHelper.querySql("");
    yield this.render('index');
});


module.exports = router;
