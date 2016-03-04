var router = require('koa-router')();

router.get('/', function *(next) {
    yield this.render('index', {
        title: "koa express",
        data: [{id: 1, name: "admin"}, {id: 2, name: "user"}]
    });

});


module.exports = router;
