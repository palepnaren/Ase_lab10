var chalk = require('chalk');
var mongoose = require( 'mongoose' );
var bcrypt=require('bcrypt');
var mongoose_delete = require('mongoose-delete');
var SALT_WORK_FACTOR = 10;

var db="mongodb://ase10:naren539@ds141937.mlab.com:41937/lab10";
//var db = "mongodb://localhost:27017/test";

mongoose.Promise = global.Promise;
mongoose.connect(db);

mongoose.connection.on("connected", function(){
  console.log(chalk.green("Mongoose connected to" +db));
});

mongoose.connection.on("error", function(err){
  console.log(chalk.red("Mongoose connection error" +err));
});

mongoose.connection.on("disconnected", function(){
  console.log(chalk.red("Mongoose disconnected with" +db));
});

//creating schema for user details.
var creatSchema = new mongoose.Schema({
    username:{unique:true, type:String},
    name:{type:String},
    email:{type:String, unique:true},
    password:String,
    cnf_passqord:String,
    age:Number

});

creatSchema.plugin(mongoose_delete);

creatSchema.pre('save', function(next){
  var user = this;
  console.log(chalk.blue("Before saving to database."));
//only checks if the has password is modifed or is it new
  if(!user.isModified('password'))
  return next();

//will generate a salt value with factor 10
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err);


  bcrypt.hash(user.password,salt,function(err, hash){
    if(err) return next(err);


    user.password= hash;
    user.cnf_passqord=hash;

    console.log("The hash is " +hash);
    next();
  });
  });

});

//checks if both passwords matched while registering.
creatSchema.methods.match=function(err,isMatch){
  if(this.password==this.cnf_password)
  return isMatch();
}

//checks if the user entered the correct password
creatSchema.methods.comparePwd=function(userPassword,cd){
  bcrypt.compare(userPassword,this.password,function(err,isMatch){
    if(err) return cb(err);
    cd(null,isMatch);
  });
}


mongoose.model('User',creatSchema);
