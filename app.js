// future additions 
//     = difficulty     easy 5 words with 4 guesscount
//                      normal 10 words with 6 guess count
//                      difficult 15 words with 8 guess count

$(document).ready(function() {
    let wordCount = 10;
    let guessCount = 4;
    let password = '';
  
    $("#start").on("click", () => {
        toggleClasses($('#start-screen'), 'hide', 'show');
        toggleClasses($('#game-screen'), 'hide', 'show');
        startGame();
    })

    const toggleClasses = (...args) => {
      for (let i = 1; i < args.length; i++) {
        args[0][0].classList.toggle(args[i]);
      }
    }
  
    const startGame = () => {
      // get random words and append them to the DOM
      let randomWords = getRandomValues(words, wordCount);
      randomWords.forEach(word => {
        $("#word-list")[0].append($(`<li class="active">${word}</li>`)[0]);
      });
  
      // set a secret password and the guess count display
      password = getRandomValues(randomWords, 1)[0];
      setGuessCount(guessCount);
  
      // add update listener for clicking on a word
      $("#word-list").on('click', updateGame);
    }
  
    const getRandomValues = (array, numberOfVals) => {
      return shuffle(array).slice(0, numberOfVals);
    }
  
    const shuffle = array => {
      let arrayCopy = array.slice();
      for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
        // generate a random index between 0 and idx1 (inclusive)
        let idx2 = Math.floor(Math.random() * (idx1 + 1));
  
        // swap elements at idx1 and idx2
        [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]]
      }
      return arrayCopy;
    }
  
    const setGuessCount = newCount => {
      guessCount = newCount;
      $("#guesses-remaining")[0].innerText = `Guesses remaining ${guessCount}.`;
    }
  
    const updateGame = e => {
      if ($(e.target)[0].tagName === "LI" && !$(e.target)[0].classList.contains("disabled")) {
        // grab guessed word, check it against password, update view
        let guess = $(e.target)[0].innerText;
        let similarityScore = compareWords(guess, password);
        $(e.target).addClass("disabled");
        $(e.target).removeClass("active");
        $(e.target).text(`${e.target.innerText} --> Matching Letters: ${similarityScore}`)
        setGuessCount(guessCount - 1);
  
        // check whether the game is over
        if (similarityScore === password.length) {
          toggleClasses($('#winner'), 'hide', 'show');
          finishGame();
        } else if (guessCount === 0) {
          toggleClasses($('#loser'), 'hide', 'show');
          finishGame();
        }
      }
    }
  
    const compareWords = (word1, word2) => {
      if (word1.length !== word2.length) throw "Words must have the same length";
      let count = 0;
      for (let i = 0; i < word1.length; i++) {
        if (word1[i] === word2[i]) count++;
      }
      return count;
    }

    const finishGame = () => {
        $("#guesses-remaining").addClass("hide");
        $("#instruction").addClass("hide");
        $(".active").removeClass("active")
        $("#word-list").off('click', updateGame);
    }
  });