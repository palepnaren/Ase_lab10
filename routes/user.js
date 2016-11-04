var mongoose = require('mongoose');
var User = mongoose.model('User');
var chalk = require('chalk');

exports.search = function(req,res){
  User.find({}, function(err, user){
    console.log(user);
  res.render('Home',{session:req.session, users:user});
  console.log('welcome to Home page');
  });

}
exports.updateUser = function(req,res){
  var name = req.body.name;
  var age = req.body.age;
  var username = req.body.username;
  User.update({name:name},{age:age,username:username},function(err, success){
    if(err){
      console.log("Update unsuccess.");
      return res.status(400).send();
    }
    else{
      User.find({},function(err, result){
      console.log("update sucess");
      console.log(result);
      res.render('Home',{users:result});
    });
    }
  });


}
exports.deleteUser = function(req, res){
  var name = req.body.name;

  var existUser = new User();
  existUser.name = name;

  User.remove({name:name},function(err, result){
    if(err){
      console.log('user unable to be deleted.');
      var message = 'Please try later after some time.';
      res.render('Home',{errorMessage:message});
    }
    else{
      User.find({},function(err,result){
        console.log('user deleted successfully.');
        console.log(result);
        res.render('Home',{users:result});
      });

    }
  });
}

exports.regUser= function(req,res) {
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var cnf_pwd = req.body.cnf_password;
  var age = req.body.age;

  var newUser = new User();
  newUser.name = name;
  newUser.username = username;
  newUser.email = email;
  newUser.password = password;
  newUser.cnf_pwd = cnf_pwd;
  newUser.age = age;

  newUser.save(function(err,user) {
    if(err){
      console.log("User with this username already exists.");
      var error = 'Please select different username or email';
      res.render('Register',{errorMessage:error});
      return;
    }
    else{
      console.log("User regitered successfully.");
      req.session.newUser = user.username;
      res.render('Welcome',{session:req.session});
    }

  });

}

exports.login = function(req, res){

  var email = req.body.email;
  var password = req.body.password;

  User.findOne({email:email},function(err,user){
    if(user==null){
      console.log("Authentication failed");
      var message='username or password invalid';
      res.render('Login',{errorMessage:message});
      return;
    }
    console.log(user);
    user.comparePwd(password,function(err,isMatch){
      if(isMatch && isMatch==true){
        console.log("Authentication success.");
        req.session.username = user.username;
        req.session.loggedIn = true;
        console.log("current user logged in is: "+req.session.username);
        res.redirect('/users');
      }
      else{
        console.log("Authentication failed.");
        var message ="Username or password invalid";
        res.render('Login', {errorMessage:message});
        return;
      }
    });
  });
}
