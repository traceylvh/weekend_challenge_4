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
router.post('/', function(req, res) {
    // console.log('body: ', req.body);
    var completeTask = {
        id: req.body.id,
        status: req.body.status
    };
    // console.log('status:', completeTask.status);

    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE todo_list SET status=($1) WHERE id=($2)",
            [completeTask.status, completeTask.id],
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
