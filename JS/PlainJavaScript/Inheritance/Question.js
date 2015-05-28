// Question - Super class
function Question(theQuestion, theChoices, theCorrectAnswer){
  //Instance properties
  this.question = theQuestion;
  this.choices = theChoices;
  this.correctAanswer = theCorrectAnswer;
  this.userAnswer = "";

  //private properties. Can't be altered by instances
  var newDate = new Date(),
    QUIZ_CREATED_DATE = newDate.toLocaleDateString();
  this.getQuizDate = function(){
    return QUIZ_CREATED_DATE;
  };
  console.log("Quiz created on: " + this.getQuizDate());

  Question.prototype.getCorrectAnswer = function(){
    return this.correctAanswer;
  };

  Question.prototype.getUserAnswer = function(){
    return this.userAnswer;
  };

  Question.prototype.displayQuestion = function(){
    var choiceCounter = 0;

    var questionToDisplay = "<div class='question input-group'>" + this.question + "</div>";
    questionToDisplay += "<ul>";
    this.choices.forEach(function(eachChoice){
      questionToDisplay += '<li>';
      questionToDisplay += '<span class="input-group-addon"><input type="radio" name="choice" value="' + choiceCounter + '">' + eachChoice + '</span>';
      questionToDisplay += '</li>';
      choiceCounter ++;
    });
    questionToDisplay += "</ul>";
  };
}

// Multiple Choice question
function MultipleChoiceQuestion(theQuestion, theChoices, theCorrectAnswer){
  //call the Question constructor
  Question.call(theQuestion, theChoices, theCorrectAnswer);
}

// Drag and drop question
function DragDropQuestion(theQuestion, theChoices, theCorrectAnswer){
  //call the Question constructor
  Question.call(theQuestion, theChoices, theCorrectAnswer);
}