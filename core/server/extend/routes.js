var express = require('express'),
    utils           = require('../utils');

module.exports = function router() {
    var router = express.Router();

    router.get('/sign-in', function(req,res){
        res.render('sign-in');
    });
    router.get('/sign-up', function(req,res){
        res.render('sign-up');
    });

    return router;
};
