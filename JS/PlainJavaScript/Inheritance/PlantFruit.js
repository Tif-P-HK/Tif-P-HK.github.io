function Plant(thisCountry, thisIsOrganic, thisColor){
  this.country = thisCountry;
  this.organic = thisIsOrganic;
  this.color = thisColor;

  Plant.prototype.showOriginAndColor = function(){
    console.log("I am a from " + this.country + " and my color is " + this.color);
  };
}

Plant.prototype.isOrganic = function(){
  var _not = this.organic === true? "" : "not ";
  console.log("I am " + _not + "organic");
};



function Fruit(thisName, thisCountry, thisIsOrganic, thisColor){
  this.name = thisName;
  this.country = thisCountry;
  this.organic = thisIsOrganic;
  this.color = thisColor;
}

Fruit.prototype = new Plant(this.country, this.organic, this.color);
Fruit.prototype.showName = function(){
  console.log("My fruit name is: " + this.name);
};