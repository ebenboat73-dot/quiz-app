# Quiz App

A browser-based JavaScript quiz application that presents users with multiple-choice questions, provides immediate feedback, tracks the user's score, and displays the final quiz results.

The quiz questions are stored in a JSON file and loaded dynamically using JavaScript.

## Features

* Start quiz functionality
* Multiple-choice questions
* Dynamic loading of questions from a JSON file
* Immediate feedback after answering a question
* Score tracking
* Question navigation
* Final quiz results
* Responsive browser-based interface

## Technologies Used

* HTML5
* JavaScript
* JSON
* CSS
* Fetch API
* Local development with VS Code and Live Server

## Project Structure

```text
Quiz App/
├── index.html
├── questions.json
├── script.js
└── README.md
```

### File Descriptions

* **index.html** — Contains the structure and interface of the quiz application.
* **script.js** — Contains the JavaScript logic for loading questions, handling user interactions, providing feedback, and tracking the score.
* **questions.json** — Contains the quiz questions and their corresponding answer data.
* **README.md** — Contains information about the project and instructions for running it.

## How to Run the Project

### Option 1: Using VS Code Live Server

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Make sure the project files are in the same folder.
4. Open `index.html`.
5. Right-click `index.html`.
6. Select **Open with Live Server**.
7. The quiz application will open in your web browser.

### Option 2: Open Directly in a Browser

You can also open `index.html` directly in a web browser.

However, using a local development server such as Live Server is recommended because the application loads the quiz questions from `questions.json` using the Fetch API.

## How the Application Works

When the application starts, the user is presented with information about the quiz and a start option.

After starting the quiz:

1. JavaScript loads the questions from `questions.json`.
2. A question is displayed with multiple answer choices.
3. The user selects an answer.
4. The application checks the selected answer against the correct answer.
5. Immediate feedback is provided.
6. The user's score is updated.
7. The next question is displayed.
8. After all questions have been answered, the final score and quiz results are displayed.

## Project Page

Live Project:

https://ebenboat73-dot.github.io/quiz-app/

## Learning Objectives

This project was built to practise and demonstrate fundamental JavaScript concepts, including:

* Variables and data types
* Arrays and objects
* Functions
* DOM manipulation
* Event handling
* Fetch API
* Promises
* JSON data
* Conditional logic
* Application state
* Score tracking
* Dynamic rendering of content

## Future Improvements

Possible improvements for future versions include:

* Adding a countdown timer
* Adding more quiz categories
* Adding difficulty levels
* Adding randomized questions
* Adding a progress indicator
* Storing previous quiz results
* Improving accessibility
* Adding a leaderboard

## Author

**Ebenezer Boateng**

Built as a JavaScript learning project and browser-based quiz application.
