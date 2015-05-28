//Create MCQ and DDQ based on Question's prototype
//Populate questions
//Create a tester
function Quiz(){
  console.log("Starting quiz...");
  createMCQ_DDQFromQuestion();

  setupAllQuestions();

  createTester();
}
function createMCQ_DDQFromQuestion(){
  inheritPrototype(MultipleChoiceQuestion, Question);

  inheritPrototype(DragDropQuestion, Question);
}

function setupAllQuestions(){
  var allQuestions = [
    new MultipleChoiceQuestion("Who is Prime Minister of England?", ["Obama", "Blair", "Brown", "Cameron"], 3),

    new DragDropQuestion("Drag the correct City to the world map.", ["Washington, DC", "Rio de Janeiro", "Stockholm"], 0)
  ];

  // Display all the questions?
  allQuestions.forEach(function(eachQuestion){
    eachQuestion.displayQuestion();
  });
}

function createTester(){
  //Create a user with constructor + inheritance pattern
  var firstUser = new User("Grizzly", "grizzly@alaska.com");
  firstUser.changeEmail("brownBear@usa.com");
  firstUser.saveScore(18);
  firstUser.saveScoresCtor(100);
  firstUser.showNameAndScores();
}