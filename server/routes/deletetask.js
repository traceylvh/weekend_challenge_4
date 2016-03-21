var express = require('express');
var router = express.Router();
var pg = require('pg');


var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/todo_db';
}



//send updated status to db
router.delete('/', function(req, res) {
    // console.log('body: ', req.body);
    var deleteTask = {
        id: req.body.id
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("DELETE FROM todo_list WHERE id=($1)",
            [deleteTask.id],
            function (err, result) {
                done();

                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

});

module.exports = router;
