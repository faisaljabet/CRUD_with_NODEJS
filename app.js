const express = require('express');
require ('dotenv').config();
const app = express();

var con = require("./connection");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.listen(3000, function(){
    console.log("Server is up and running ");
})

app.post("/", function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    console.log(name, email);
    var sql = 'INSERT into `user_info` (`user_name`, `user_email`) values ?';
    var values = [[name, email]];
    con.query(sql, [values], function(err, result){
        if(err) throw err;
        console.log("Data inserted");
        res.redirect('/');
    })
})


app.get("/", function(req, res){
    var sql = 'SELECT * FROM user_info';
    con.query(sql, function(error, results){
        if(error) throw error;
        res.render("display", {user_info : results});
    });
});

app.get("/update", function(req, res){
    con.connect(function(error){
        if(error) console.log(error);
        var sql = "SELECT * FROM user_info where user_id = ?";
        var id = req.query.id;
        con.query(sql, [id], function(error, result){
            if(error) console.log(error);
            res.render('update.ejs', {user_info : result});
        })
    })
});

app.post("/updateData", function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var id = req.body.id;
    console.log(name, email, id);
    var sql = "UPDATE user_info set user_name=?, user_email=? where user_id=?";
    con.query(sql, [name, email, id], function(error, result){
        if(error) throw error;
        console.log("Data Updated");
        res.redirect("/");
    })
})

app.get("/delete", function(req, res){
    con.connect(function(err){
        if(err) console.log(err);
        var sql = "DELETE FROM user_info WHERE user_id=?";
        var id = req.query.id;
        con.query(sql, [id], function(error, result){
            if(error) console.log(error);
            res.redirect("/");
        })
    })
})