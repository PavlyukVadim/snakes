/**
 * Created by amadev on 25.11.16.
 */
var mongoose = require('./libs/mongoose');
var User = require('./models/user').User;

mongoose.connection.on('open', function () {
   var db = mongoose.connection.db;
    db.dropDatabase(function (err) {
        if (err) throw err;
        console.log("OK");

        mongoose.disconnect();
    })
});