
/*
 * GET home page.
 */
var mongoose = require('../libs/mongoose');

exports.index = function(req, res){
    mongoose.CategoryModel.find().sort('-title').exec(function (err, cats) {
        console.log(cats);
        res.render('index', { title: 'Facebook Categories', cats: cats});
    });
};