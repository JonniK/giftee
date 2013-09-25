/**
 * Created with JetBrains PhpStorm.
 * User: JonniK
 * Date: 25.09.13
 * Time: 0:43
 * To change this template use File | Settings | File Templates.
 */
var mongoose    = require('mongoose');
var log         = require('./log')(module);
var config      = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas
var Category = new Schema({
    fbId: {type: String, required: true, unique: true},
    title: { type: String, required: true }
});

var AgeInterval = new Schema({
    minAge: {type: Number, min: 0, max: 150, default: 0},
    maxAge: {type: Number, min: 1, max: 150, default: 150}
});
AgeInterval.methods.check = function(num) {
    return this.minAge <= num && num <= this.maxAge;
}
var Label = new Schema({
    title: { type: String, required: true },
    gender: Boolean,
    active: {type: Boolean, index: true, default: true},
    categories: [Category],
    intervals: [AgeInterval],
    modified: { type: Date, default: Date.now }
});

Label.methods.checkIntervals = function (num) {
    if(this.intervals.length == 0) return true;
    for(var ind in this.intervals) {
        if(this.intervals[ind].check(num)) return true;
    }
    return false;
}

/*
// validation
Article.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});
*/
var LabelModel = mongoose.model('Label', Label);
var CategoryModel = mongoose.model('Category', Category);
/*
CategoryModel.remove({}, function (err) {
    console.log('remove', err);
});
*/
CategoryModel.find().limit(1).exec(function (err, data){
    console.log("data", data, "err", err);
    if(!data.length) {
        var fbCats = require('../fbcats.js');
        for(var key in fbCats.facebookCategories) {
            for(var id in fbCats.facebookCategories[key]) {
                CategoryModel.create({fbId: id, title: fbCats.facebookCategories[key][id]}, function (err, cat) {
                    console.log('create err:', err, 'cat', cat);
                });
            }
        }
    }
});
/**/
module.exports.LabelModel = LabelModel;
module.exports.CategoryModel = CategoryModel;