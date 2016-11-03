var express = require('express');
var chalk = require('chalk');
var session = require('express-session');
var bdyParser = require('body-parser');
var mongoose = require('mongoose');
var db=require('./db/mongo.js');
var router = express.Router();
var route = require('./routes/route.js');
var user=require('./routes/user.js');
var app = express();

//this will set up the view engine for our application.
app.set('view engine', 'ejs');

//this will make all the files in public folder available to all the users.
app.use(express.static(__dirname+'/public'));

//this will help us to read the body parameters of the post method.
app.use(bdyParser.json());
app.use(bdyParser.urlencoded({extended:false}));

//setting up a session which uses some secret for encryption of the session.
app.use(session({secret:"bfdddmsiiqiobcxnkallaowjsnxmk", resave: true, saveUninitialized: true}));

app.get('/',route.login);

app.post('/newUser',user.regUser);
app.get('/register', route.reg);
app.get('/login',route.login);
app.get('/users', user.search);
app.post('/authenticate',user.login);
app.post('/delete', user.deleteUser);
app.put('/update',user.updateUser);
app.get('/logout',route.logout);
//app will run on this port number on localhost.
var port = process.env.PORT || 8080;

var server = app.listen(port, function(req,res){
     console.log(chalk.blue("server started on port:"+port));
})
