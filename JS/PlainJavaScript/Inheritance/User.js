//User() constructor
function User(theName, theEmail){
  //The use of "this" keyword inside the function
  //specifies that these properties will be
  //unique to every instance of User
  this.name = theName;
  this.email = theEmail;
  this.quizScores = [];
  this.currentScore = 0;
  this.saveScoresCtor = function(theScoreToAdd){
    this.quizScores.push(theScoreToAdd);
  };
}

//Overwriting User's prototype. When doing so the constructor is also overwritten
//Therefore need to set constructor to be User
//
//User() constructor now inherits all properties and methods of the
//{} object (defined by object literal) defined after .prototype =
//
//This is a simple way of overwriting the constructor i.e.
//saveScore:function(){}; instead of User.prototype.saveScore:function(){}
User.prototype = {
  constructor:User,
  saveScore:function(theScoreToAdd){
    this.quizScores.push(theScoreToAdd);
  },
  showNameAndScores:function(){
    var scores = this.quizScores.length > 0 ? this.quizScores.join(',') : "no scores";
    console.log(this.name + ' scores: ' + scores);
  },
  changeEmail:function(newEmail){
    this.email = newEmail;
  }
};

