var mongoose = require( 'mongoose' );




exports.login=function(req, res){
  res.render('Login');
}
exports.reg=function(req, res){
  res.render('Register');
}
exports.logout=function(req, res){
  res.render('Login');
}
