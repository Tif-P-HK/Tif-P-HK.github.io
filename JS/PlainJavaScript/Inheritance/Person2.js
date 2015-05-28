function Person2(n, race){

  // ************************************************************************
  //Private variables and functions
  //Only privileged methods may view, modify, invoke
  // ************************************************************************
  var alive = true, age = 1;
  var maxAge = 70 + Math.round(Math.random()*15) * 2;
  var myName = n? n: "Alan the Titan";
  var weight = 1;
  function makeOlder(){
    return alive = (++age <= maxAge );
  }

  // ************************************************************************
  //Privileged methods
  //May be invoked publicly, may access private items
  //May not be changed, may be replaced with public favors
  // ************************************************************************
  this.toString = this.getName = function(){
    return myName;
  };
  this.eat = function(){
    if(makeOlder()){
      this.dirtyFactor ++;
      weight *=3;
    }else{
      console(myName + " can't eat. he's dead");
    }
  };
  this.exercise = function(){
    if(makeOlder()){
      this.dirtyFactor ++;
      weight /=2;
    }else{
      console(myName + " can't exercise. he's dead");
    }
  };
  this.weigh = function(){return weight;}
  this.getRace = function(){return race;}
  this.getAge = function(){return age;}
  this.muchTimePass = function(){age += 50; this.dirtFactor += 10;}

  // ************************************************************************
  //Public properties
  // ************************************************************************
  this.dirtFactor = 0;
  this.clothing = "naked";

  // ************************************************************************
  //Public Properties
  // ************************************************************************






// ************************************************************************
}