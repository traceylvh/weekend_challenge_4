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

//create schema code for heroku

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
    //TODO end process with error code
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS todo_list (' +
    'id SERIAL PRIMARY KEY,' +
    'task varchar NOT NULL,' +
    'status boolean DEFAULT TRUE);'
  );

  query.on('end', function(){
    console.log('Successfully ensured schema exists');
    done();
  });

  query.on('error', function() {
    console.log('Error creating schema!');
    //TODO exit(1)
    done();
  });
}
});




//send list data back to front end
router.get('/', function(req, res) {
    var list = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM todo_list ORDER BY status DESC;');

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
    var addTask = {
        task: req.body.task,
        // status: req.body.status
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO todo_list (task) VALUES ($1) RETURNING id",
            [addTask.task],
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
