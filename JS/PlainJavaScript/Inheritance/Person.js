//http://phrogz.net/JS/classes/OOPinJS.html

function Person(n, race){
  this.constructor.population++;

  // ************************************************************************
  //Private variables and functions
  //only privileged methods may view, modify, invoke
  // ************************************************************************
  var alive = true, age = 1;
  var maxAge = 70 + Math.round(Math.random()*15) * 2;
  var myName = n? n: "Doolin Dalton";
  var weight = 1;
  function makeOlder(){
    return alive = (++age <= maxAge);
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
      console.log(myName + "can't eat, he's dead");
    }else{
      this.dirtFactor ++;
      weight *= 3;
      return weight;
    }
  };

  this.exercise = function(){
    if(makeOlder()){
      console.log(myName + "can't exercise, he's dead");
    }else{
      this.dirtFactor ++;
      weight /= 2;
      return weight;
    }
  };
  this.weigh = function(){ return weight;  };
  this.getRace = function(){ return race;  };
  this.getAge = function(){ return age; };
  this.muchTimePass = function(){age += 50; this.dirtFactor += 10;};

  // ************************************************************************
  //Public properties
  //Anyone may read or write
  // ************************************************************************
  this.dirtFactor = 0;
  this.clothing = "naked";
}

// ************************************************************************
//Public methods
//Anyone may read or write
// ************************************************************************
Person.prototype.beCool = function(){
  this.clothing = "khakis and black shirt";
};
Person.prototype.shower = function(){
  this.dirtFactor = 2;
};
Person.prototype.showLegs = function(){
  console.log(this + " has " + this.legs + " legs");
};
Person.prototype.amputate = function(){
  console.log(--this.legs);
};

// ************************************************************************
//Prototype properties
//Anyone may read or write
// ************************************************************************
Person.prototype.legs = 2;

// ************************************************************************
//Static properties
//Anyone may read or write
// ************************************************************************
Person.population = 0;










