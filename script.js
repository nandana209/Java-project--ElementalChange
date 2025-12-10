// --- Game State Variables ---
let userScore = 0;
let compScore = 0;
let roundsPlayed = 0; 
let matchLimit = 0; 
const choices = ['e', 'w', 'l']; // e:Earth, w:Water, l:Lightning

// --- DOM Elements ---
const userScoreEl = document.getElementById('user-score');
const compScoreEl = document.getElementById('comp-score');
const resultEl = document.getElementById('result');
const historyEl = document.getElementById('history');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetBtn = document.getElementById('reset');

// Limit Elements
const matchLimitInput = document.getElementById('match-limit');
const setLimitBtn = document.getElementById('set-limit');


// --- Helper Functions ---

/** Enables or disables the choice buttons and limit controls */
function toggleChoices(enable) {
    choiceButtons.forEach(button => {
        button.disabled = !enable;
    });
    // Disable limit controls while the game is running
    matchLimitInput.disabled = enable; 
    setLimitBtn.disabled = enable;
}

/** Determines the winner of the overall game series */
function finalizeGame() {
    toggleChoices(false); // Disable buttons
    let finalMessage = "GAME OVER! ";
    
    if (userScore > compScore) {
        finalMessage += `You win the series, ${userScore} to ${compScore}! 🎉`;
        resultEl.className = 'message win';
    } else if (compScore > userScore) {
        finalMessage += `The computer wins the series, ${compScore} to ${userScore}! 😭`;
        resultEl.className = 'message lose';
    } else {
        finalMessage += `The series is a DRAW! ${userScore} to ${compScore}! 🤝`;
        resultEl.className = 'message draw';
    }
    resultEl.textContent = finalMessage;
}

/** Gets a random choice for the computer */
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

/** Converts the single-letter choice to a full name for display */
function getName(choice) {
    if (choice === 'e') return 'Earth ⛰';
    if (choice === 'w') return 'Water 💧';
    if (choice === 'l') return 'Lightning ⚡';
    return '';
}

/** Determines the winner of a single round based on E-W-L rules */
function determineWinner(userChoice, compChoice) {
    if (userChoice === compChoice) {
        return 'draw';
    }

    // Win conditions: (User wins if this evaluates to true)
    // Water (w) beats Earth (e)
    // Earth (e) beats Lightning (l)
    // Lightning (l) beats Water (w)
    if (
        (userChoice === 'w' && compChoice === 'e') ||
        (userChoice === 'e' && compChoice === 'l') ||
        (userChoice === 'l' && compChoice === 'w')
    ) {
        return 'win';
    } else {
        return 'lose';
    }
}

/** Updates the score and displays the result message */
function displayResult(userChoice, compChoice, outcome) {
    let message = '';
    let emoji = '';
    
    // Update score based on outcome
    if (outcome === 'win') {
        userScore++;
        message = 'You WON!';
        emoji = '✅';
        resultEl.className = 'message win';
    } else if (outcome === 'lose') {
        compScore++;
        message = 'You LOST!';
        emoji = '❌';
        resultEl.className = 'message lose';
    } else {
        message = 'It\'s a DRAW!';
        emoji = '➖';
        resultEl.className = 'message draw';
    }

    // Update the DOM elements
    userScoreEl.textContent = `You: ${userScore}`;
    compScoreEl.textContent = `Computer: ${compScore}`;
    
    const userDisplay = getName(userChoice);
    const compDisplay = getName(compChoice);

    // Display full round details
    resultEl.textContent = `${emoji} Round ${roundsPlayed}/${matchLimit}: You chose ${userDisplay}, Computer chose ${compDisplay}. ${message}`;
    
    // Add result to history
    const historyItem = document.createElement('div');
    historyItem.textContent = `Round ${roundsPlayed}: ${message} (${userDisplay} vs ${compDisplay})`;
    historyEl.prepend(historyItem);
}

/** Main function to run a single round of the game */
function playRound(userChoice) {
    // Only run the round if we haven't reached the limit
    if (roundsPlayed < matchLimit) { 
        roundsPlayed++;
        const compChoice = getComputerChoice();
        const outcome = determineWinner(userChoice, compChoice);
        displayResult(userChoice, compChoice, outcome);

        // Check if the game limit has been reached after this round
        if (roundsPlayed >= matchLimit) {
            finalizeGame();
        }
    }
}

/** Resets the game state */
function resetGame() {
    userScore = 0;
    compScore = 0;
    roundsPlayed = 0;
    matchLimit = 0;
    
    userScoreEl.textContent = `You: 0`;
    compScoreEl.textContent = `Computer: 0`;
    resultEl.textContent = 'Set the match limit and press "Set Limit" to begin!';
    resultEl.className = 'message';
    historyEl.innerHTML = '';
    toggleChoices(false);
}

// --- Event Listeners ---

// 1. Set Limit Button Logic
setLimitBtn.addEventListener('click', () => {
    const limit = parseInt(matchLimitInput.value);
    
    if (limit > 0 && limit <= 50) {
        matchLimit = limit;
        // Reset scores and rounds for a new game
        userScore = 0;
        compScore = 0;
        roundsPlayed = 0;

        userScoreEl.textContent = `You: 0`;
        compScoreEl.textContent = `Computer: 0`;
        historyEl.innerHTML = '';
        
        toggleChoices(true); // Enable choices to start playing
        resultEl.textContent = `Game started! Playing a series of ${matchLimit} rounds. Choose your move!`;
        resultEl.className = 'message';
    } else {
        alert('Please enter a valid number of matches between 1 and 50.');
    }
});


// 2. Attach event listener to all choice buttons (to play a round)
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const userChoice = button.id; // button.id is 'e', 'w', or 'l'
        if (matchLimit > 0 && roundsPlayed < matchLimit) { 
            playRound(userChoice);
        }
    });
});

// 3. Attach event listener to the reset button
resetBtn.addEventListener('click', resetGame);

// Initial state: Disable choices until a limit is set
toggleChoices(false);
