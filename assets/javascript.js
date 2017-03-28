(function() {
  var questions = [{
    question: 'In the episode "A Peice of the Action" Captain Kirk makes up a card game to distract his captors. What name did he give to the game?' ,
    choices: ['Frizzbee', 'Freezy','Frazz','Fizzbin'],
    correctAnswer: 3
  }, {
    question: "Mr. Spock very rarely showed emotion, but in which episode did we see him cry?",
    choices: ["Mudd's Women", 'The Naked Time', 'Balance of Terror', 'The Enemy Within', 'Arena'],
    correctAnswer: 1
  }, {
    question: "Once, Chekov was wrong about his own family history. In 'Day of the Dove', Chevkov claims he has the right to avenge the death of his brother, Piotr, who was killed in a Klingon raid. Why is this inaccurate?",
    choices: ['His siblings were sisters', 'Piotr was his pet dog', 'He was an only child', 'Romulans killed Piotr', 'Chekov is Piotr'],
    correctAnswer: 2
  }, {
    question: "What is Scott's first name?",
    choices: ['Montgomery', 'Walter', 'Clyde', 'Bruce', 'Bill'],
    correctAnswer: 0
  }, {
    question: "What is the registry number for the star ship Enterprise in the original series?",
    choices: ['Trekone','USS-North Carolina', 'CVA-60', 'NCC-Enterprise', 'NCC-1701'],
    correctAnswer: 4
  }];
  var timer = 120; //Timer of course
  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $('#quiz'); //Quiz div object
  var timerId;
  // Display initial question
  displayNext();
  
  // Display Timer
  function time() {
    timerId = setInterval(decrement, 1000);
  }
  // Decrement function
  function decrement() {
    timer --;
    $('#timer').html("<h2>" + timer + "</h2>");
    if (timer === 0){
      alert("Time Up!")
      clearInterval(timerId);
      timeOut();
    }
  }
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
    
    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
      return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Please make a selection!');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    timer = 30;
    questionCounter = 0;
    selections = [];
    displayNext();
    time();
    $('#start').hide();
    $('#score').remove();
  });
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);
    
    var question = $('<p>').append(questions[index].question);
    qElement.append(question);
    
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    
    return qElement;
  }
  
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item)
      radioList.append($('<br>'));
    }
    return radioList;
  }
  
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
      }
    });
  }
  //Function run on timeout
  function timeOut(){
    var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
  }
  
  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<p>',{id: 'score'});
    
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }
    
    score.append('You got ' + numCorrect + ' questions out of ' +
                 questions.length + ' right!!!');
    return score;
  }
  time();
})();
