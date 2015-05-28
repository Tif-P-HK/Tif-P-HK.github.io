function runScript(){
  //http://phrogz.net/JS/classes/OOPinJS.html
  //Simple object with private, privileged, public properties and methods
  runPeoplesLife();

  //http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/
  //inheritance with simple objects
  inheritanceWithSimpleObjects();

  ////http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
  //some inheritance patterns:
  //constructor, prototype, a mix of both
  //parasite combination inheritance
  inheritancePatterns();

  //http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
  //Use the Quiz object to create quiz questions and a user
  //*** a failed attempt ***
  Quiz();
}

function runPeoplesLife(){
  console.log("*****************************");
  console.log("The ballad of two dump people");
  console.log("*****************************");
  var gk = new Person("White Hawk", "universe 1");
  var lk = new Person("Victoria Qoo", "universe 2");

  alert("There are now "+Person.population+" people");

  gk.showLegs(); lk.showLegs();                 //Both share the common 'Person.prototype.legs' variable when looking at 'this.legs'

  gk.race = "hispanic";                         //Sets a public variable, but does not overwrite private 'race' variable.
  alert(gk+"'s real race is "+gk.getRace());    //Returns 'caucasian' from private 'race' variable set at create time.
  gk.eat(); gk.eat(); gk.eat();                 //weigh is 3...then 9...then 27
  alert(gk+" weighs "+gk.weigh()+" pounds and has a dirt factor of "+gk.dirtFactor);

  gk.exercise();                                //weigh is now 13.5
  gk.beCool();                                  //clothing has been update to current fashionable levels
  gk.clothing="Pimp Outfit";                    //clothing is a public variable that can be updated to any funky value
  gk.shower();
  alert("Existing shower technology has gotten "+gk+" to a dirt factor of "+gk.dirtFactor);

  gk.muchTimePasses();                          //50 Years Pass
  Person.prototype.shower=function(){           //Shower technology improves for everyone
    this.dirtFactor=0;
  }
  gk.beCool=function(){                         //Gavin alone gets new fashion ideas
    this.clothing="tinfoil";
  };

  gk.beCool(); gk.shower();
  alert("Fashionable "+gk+" at "
    +gk.getAge()+" years old is now wearing "
    +gk.clothing+" with dirt factor "
    +gk.dirtFactor);

  gk.amputate();                                //Uses the prototype property and makes a public property
  gk.showLegs(); lk.showLegs();                 //Lisa still has the prototype property

  gk.muchTimePasses();                          //50 Years Pass...Gavin is now over 100 years old.
  gk.eat();


}

function inheritanceWithSimpleObjects(){
  //Explore object with inheritance
  console.log("plant speaking...");
  var genericPlant = new Plant("Taiwan", true, "Green");
  genericPlant.showOriginAndColor();
  genericPlant.isOrganic();

  console.log("Mango speaking...");
  var mangoPlant = new Fruit("Mango", "Philippines", false, "Yellow");
  mangoPlant.showName();
  mangoPlant.showOriginAndColor();
  genericPlant.isOrganic();
}

function inheritancePatterns(){
  //create an object using Prototype Pattern
  createByPrototypePattern();

  //create an object using Constructor Pattern
  createByConstructorPattern();

  //Create an object by doing Object create
  createByObjectCreate();

  //Create By Parasite Combination Inheritance pattern
  createByParasiteCombinationInheritance();
}

function createByConstructorPattern(){
  function EmployeeCtor(firstName, lastName){
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = function(){
      return this.firstName + " " + this.lastName;
    };
  }

  var emp6493 = new EmployeeCtor("T6493", "Ctor");
  console.log(emp6493.fullName());
}

function createByPrototypePattern(){
  function Employee(firstName, lastName){
    Employee.prototype.firstName = firstName;
    Employee.prototype.lastName = lastName;
    Employee.prototype.startDate = new Date();
    Employee.prototype.fullName = function(){
      return this.firstName + " " + this.lastName;
    };
  }

  var emp6492 = new Employee("T6492", "Prototype");
  console.log(emp6492.fullName());
}

function createByObjectCreate(){
  var cars = {
    wheels: 4,
    year:20115
  };

  //use Object.create to copy properties of parent to child
  //i.e. cars into toyota
  var toyota = Object.create(cars);
  console.log(toyota.type + ", " + toyota.wheels + ", " + toyota.year);
}

function createByParasiteCombinationInheritance(){
  var child = function(){
    this.type = "child"
  };
  var parent = function(){
    this.type = "parent"
  };
  inheritPrototype(child, parent);
}

function inheritPrototype(childO, parentO){
  //Create a copyOfParent object of type of parentO
  //copyOfParent now has everything from parentO
  var copyOfParent = Object.create(parentO.prototype);

  //Make childO inherits from copyOfParent
  //It copies everything, including constructor
  //which is parent()
  childO.prototype = copyOfParent;

  //Hence the last step is to set back childO's constructor to child()
  childO.prototype.constructor = childO;
}
