const QUIZ_DURATION_SECONDS = 20;

const state = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    timeRemaining: QUIZ_DURATION_SECONDS,
    timerId: null
};

const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");
const questionView = document.querySelector("#question-view");
const resultsView = document.querySelector("#results-view");
const questionCount = document.querySelector("#question-count");
const progressTrack = document.querySelector(".progress-track");
const progressFill = document.querySelector("#progress-fill");
const scoreValue = document.querySelector("#score-value");
const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");
const timerText = document.querySelector("#timer-text");
const timerFill = document.querySelector("#timer-fill");

function loadQuestions() {
    fetch("questions.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("The questions could not be loaded.");
            }
            return response.json();
        })
        .then(questions => {
            const validQuestions = Array.isArray(questions) && questions.length > 0 && questions.every(question =>
                typeof question.question === "string" &&
                Array.isArray(question.options) &&
                question.options.length === 4 &&
                Number.isInteger(question.correctAnswer) &&
                question.correctAnswer >= 0 &&
                question.correctAnswer < question.options.length
            );

            if (!validQuestions) {
                throw new Error("The question data is incomplete or invalid.");
            }

            state.questions = questions;
            loadingMessage.hidden = true;
            questionView.hidden = false;
            renderQuestion();
        })
        .catch(error => {
            loadingMessage.hidden = true;
            errorMessage.textContent = `${error.message} Run this page from a local web server and try again.`;
            errorMessage.hidden = false;
        });
}

function renderQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    const questionNumber = state.currentQuestionIndex + 1;
    const progress = (questionNumber / state.questions.length) * 100;

    questionCount.textContent = `Question ${questionNumber} of ${state.questions.length}`;
    progressTrack.setAttribute("aria-valuemax", state.questions.length);
    progressTrack.setAttribute("aria-valuenow", questionNumber);
    progressFill.style.width = `${progress}%`;
    scoreValue.textContent = state.score;
    questionText.textContent = question.question;
    feedback.textContent = "";
    feedback.className = "feedback";
    nextButton.hidden = true;
    answerList.replaceChildren();

    question.options.forEach((option, optionIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-button";
        button.dataset.optionIndex = optionIndex;

        const key = document.createElement("span");
        key.className = "answer-key";
        key.textContent = String.fromCharCode(65 + optionIndex);

        const label = document.createElement("span");
        label.textContent = option;

        button.append(key, label);
        button.addEventListener("click", () => selectAnswer(optionIndex));
        answerList.append(button);
    });

    resetTimer();
    questionText.focus({ preventScroll: true });
}

function selectAnswer(selectedIndex) {
    if (state.answers[state.currentQuestionIndex]) return;

    const question = state.questions[state.currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswer;

    state.answers[state.currentQuestionIndex] = {
        selectedIndex,
        isCorrect,
        timedOut: false
    };

    if (isCorrect) state.score += 1;
    scoreValue.textContent = state.score;

    [...answerList.children].forEach((button, optionIndex) => {
        button.disabled = true;
        if (optionIndex === question.correctAnswer) button.classList.add("is-correct");
        if (optionIndex === selectedIndex && !isCorrect) button.classList.add("is-incorrect");
    });

    feedback.textContent = isCorrect
        ? "That's right. Nice work."
        : `Not quite. The correct answer is ${question.options[question.correctAnswer]}.`;
    feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
    showNextButton();
}

function showNextButton() {
    nextButton.textContent = state.currentQuestionIndex === state.questions.length - 1
        ? "See results"
        : "Next question";
    nextButton.insertAdjacentHTML("beforeend", ' <span aria-hidden="true">&rarr;</span>');
    nextButton.hidden = false;
}

function moveToNextQuestion() {
    clearInterval(state.timerId);
    state.timerId = null;

    if (state.currentQuestionIndex === state.questions.length - 1) {
        showResults();
        return;
    }

    state.currentQuestionIndex += 1;
    renderQuestion();
}

function showResults() {
    clearInterval(state.timerId);
    questionView.hidden = true;
    resultsView.hidden = false;

    const total = state.questions.length;
    const percentage = Math.round((state.score / total) * 100);
    document.querySelector("#result-title").textContent = percentage >= 80
        ? "Nicely done."
        : percentage >= 50 ? "Good work. Keep going." : "A good place to start.";
    document.querySelector("#result-caption").textContent = `You answered ${state.score} of ${total} questions correctly.`;
    document.querySelector("#result-score").textContent = `${state.score}/${total}`;

    const reviewList = document.querySelector("#review-list");
    reviewList.replaceChildren();

    state.questions.forEach((question, index) => {
        const answer = state.answers[index];
        const item = document.createElement("li");
        item.className = "review-item";

        const prompt = document.createElement("p");
        prompt.className = "review-question";
        prompt.textContent = `${index + 1}. ${question.question}`;

        const selected = document.createElement("p");
        selected.className = `review-answer ${answer?.isCorrect ? "is-correct" : "is-incorrect"}`;
        const selectedLabel = document.createElement("strong");
        selectedLabel.textContent = answer?.timedOut
            ? "Time ran out"
            : answer ? `Your answer: ${question.options[answer.selectedIndex]}` : "Not answered";
        selected.append(selectedLabel);

        if (!answer?.isCorrect) {
            const correct = document.createElement("p");
            correct.className = "review-answer";
            correct.textContent = `Correct answer: ${question.options[question.correctAnswer]}`;
            item.append(prompt, selected, correct);
        } else {
            item.append(prompt, selected);
        }

        reviewList.append(item);
    });

    document.querySelector("#restart-button").focus();
}

function resetTimer() {
    clearInterval(state.timerId);
    state.timeRemaining = QUIZ_DURATION_SECONDS;
    renderTimer();
    state.timerId = setInterval(() => {
        state.timeRemaining -= 1;
        renderTimer();

        if (state.timeRemaining <= 0) {
            clearInterval(state.timerId);
            state.timerId = null;
            state.answers[state.currentQuestionIndex] = {
                selectedIndex: null,
                isCorrect: false,
                timedOut: true
            };
            [...answerList.children].forEach(button => { button.disabled = true; });
            feedback.textContent = "Time is up. Move on when you're ready.";
            feedback.classList.add("is-incorrect");
            showNextButton();
        }
    }, 1000);
}

function renderTimer() {
    timerText.textContent = `${state.timeRemaining}s`;
    timerFill.style.width = `${(state.timeRemaining / QUIZ_DURATION_SECONDS) * 100}%`;
    timerFill.classList.toggle("is-low", state.timeRemaining <= 5);
}

nextButton.addEventListener("click", moveToNextQuestion);
document.querySelector("#restart-button").addEventListener("click", () => {
    clearInterval(state.timerId);
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.answers = [];
    resultsView.hidden = true;
    questionView.hidden = false;
    renderQuestion();
});

loadQuestions();