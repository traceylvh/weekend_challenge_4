var express = require("express");
var app = express();
var path = require("path");
var index = require("./routes/index");
var todos = require("./routes/todos.js");
var complete = require("./routes/complete.js");
var deletetask = require("./routes/deletetask.js");
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set("port", (process.env.PORT || 5000));

app.use("/todos", todos);
app.use("/complete", complete);
app.use("/deletetask", deletetask);
app.use("/", index);

app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});
