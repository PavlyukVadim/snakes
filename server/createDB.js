let mongoose = require('./libs/mongoose');
let User = require('./models/user').User;

mongoose.connection.on('open', function () {
  let db = mongoose.connection.db;
  db.dropDatabase(function (err) {
    if (err) {
    	throw err;
    }
    console.log('Ok');
    mongoose.disconnect();
  });
});
