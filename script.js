let startTime;
let timer;
let timeLeft = 60; // Time for test (in seconds)
let isTestRunning = false;
let correctChars = 0;
let totalChars = 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let userName = ""; // To store the user's name
let totalWordsTyped = 0; // Total words typed across all paragraphs

// A pool of meaningful sentences that will be used to generate random paragraphs
const sentencePool = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "In the middle of difficulty lies opportunity.",
    "The only way to do great work is to love what you do.",
    "It always seems impossible until it’s done.",
    "Life is what happens when you’re busy making other plans.",
    "You only live once, but if you do it right, once is enough.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Don’t watch the clock; do what it does. Keep going."
];

// Function to generate a random meaningful paragraph from the sentence pool
function generateRandomText() {
    let paragraph = "";
    const numberOfSentences = Math.floor(Math.random() * 4) + 3; // Generate a paragraph with 3-6 sentences

    for (let i = 0; i < numberOfSentences; i++) {
        const randomIndex = Math.floor(Math.random() * sentencePool.length);
        paragraph += sentencePool[randomIndex] + " ";
    }

    // Set the text to be typed on the page
    document.getElementById('text-to-type').textContent = paragraph.trim();
}

// Start the test when the user clicks the start button
function startTest() {
    userName = document.getElementById('user-name').value.trim();
        
    if (userName === "") {
        alert("Please enter your name to start.");
        return;
    }

    // Hide name section and show test area
    document.getElementById('name-section').style.display = "none";
    document.querySelector('.test-area').style.display = "block";

    isTestRunning = true;
    document.getElementById('user-input').disabled = false; // Enable typing area
    document.getElementById('start-btn').disabled = true; // Disable the start button
    document.getElementById('next-btn').style.display = "none"; // Hide next button initially
    generateRandomText(); // Generate random paragraph
    startTime = new Date();
    timer = setInterval(updateTimer, 1000); // Start timer
}

// Update timer and handle test end
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        endTest();
    } else {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
    }
}

// End the test, calculate WPM and accuracy
function endTest() {
    const userText = document.getElementById('user-input').value;
    const wordsTyped = userText.trim().split(/\s+/).length;
    totalWordsTyped += wordsTyped; // Add to total words typed

    const wpm = Math.round((totalWordsTyped / (60 - timeLeft)) * 60);
    const accuracy = Math.round((correctChars / totalChars) * 100);
    
    document.getElementById('wpm').textContent = wpm;
    document.getElementById('accuracy').textContent = accuracy + '%';

    // Add score to leaderboard and update localStorage
    const score = { name: userName, wpm, accuracy, time: new Date().toLocaleString() };
    leaderboard.push(score);
    leaderboard.sort((a, b) => b.wpm - a.wpm); // Sort by WPM descending
    leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    displayLeaderboard();
    
    // Disable typing area and show new task button
    document.getElementById('user-input').disabled = true;
    document.getElementById('new-task-btn').style.display = "inline-block"; // Show button
}

// Compare typed input with the provided text to calculate accuracy
document.getElementById('user-input').addEventListener('input', function() {
    const userText = document.getElementById('user-input').value;
    
    correctChars = 0;
    totalChars = userText.length;

    for (let i = 0; i < userText.length; i++) {
        if (userText[i] === document.getElementById('text-to-type').textContent[i]) {
            correctChars++;
        }
    }
});

// Submit the test when Enter key is pressed
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Prevent the default 'Enter' behavior (line break)
        nextParagraph();  // Move to the next paragraph
    }
});

// Display leaderboard on the page
function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    leaderboard.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score.name}: WPM: ${score.wpm}, Accuracy: ${score.accuracy}%`;
        leaderboardList.appendChild(li);
    });
}

// Function to move to the next paragraph
function nextParagraph() {
    const userText = document.getElementById('user-input').value;
    
    // Only count words if the user has typed something
    if (userText.trim().length > 0) {
        const wordsTyped = userText.trim().split(/\s+/).length;
        totalWordsTyped += wordsTyped; // Update total words typed
    }

    document.getElementById('user-input').value = ''; // Clear user input area
    generateRandomText(); // Generate new random text
}

// Function to start a new task after the previous one ends
function startNewTask() {
    timeLeft = 60;
    document.getElementById('timer').textContent = timeLeft;
    totalWordsTyped = 0;
    document.getElementById('wpm').textContent = "0";
    document.getElementById('accuracy').textContent = "100%";
    document.getElementById('user-input').disabled = false;
    document.getElementById('new-task-btn').style.display = "none";
    document.getElementById('start-btn').disabled = false;
    document.querySelector('.test-area').style.display = "none";
    document.getElementById('name-section').style.display = "block";
}


function openForm() {
        document.getElementById("suggestionForm").style.display = "block";
    }

    function closeForm() {
        document.getElementById("suggestionForm").style.display = "none";
    }

    function submitSuggestion() {
        let suggestion = document.getElementById("suggestionText").value;
        if (suggestion.trim() !== "") {
            alert("Thanks for your suggestion: " + suggestion);
            document.getElementById("suggestionText").value = "";
            closeForm();
        } else {
            alert("Please enter a suggestion before submitting.");
        }
    }




