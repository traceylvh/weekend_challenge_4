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



//send list data back to front end
router.get('/', function(req, res) {
    var list = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM todo_list ORDER BY id;');

        // Stream list back one row at a time
        query.on('row', function(row) {
            list.push(row);
        });

        // close connection
        query.on('end', function() {
            done();
            return res.json(list);
        });

        if(err) {
            console.log(err);
        }
    });
});




//post and connect data route
router.post('/', function(req, res) {
    var completeTask = {
        id: req.body.id,
        status: req.body.status
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE todo_list (status) VALUES ($1) RETURNING id",
            [completeTask.status],
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
