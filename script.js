
// =====================================
// INTERVIEWACE AI - SCRIPT.JS
// =====================================

// Demo registered users
const registeredUsers = [
  { name: "Student", password: "student123" }
];

// =====================================
// LOGIN VALIDATION
// =====================================

function loginUser(name, password) {
  const user = registeredUsers.find(
    u => u.name === name.trim() && u.password === password
  );

  if (!user) {
    alert("User not found or incorrect password!");
    return false;
  }

  localStorage.setItem("loggedInUser", user.name);
  window.location.href = "dashboard.html";
  return true;
}

// =====================================
// LOGOUT
// =====================================

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// =====================================
// MOCK INTERVIEW QUESTIONS
// =====================================

let questions = [];
let answers = {};
let skipped = new Set();
let currentQuestion = 0;

function startInterview(selectedQuestions) {
  questions = selectedQuestions;
  answers = {};
  skipped = new Set();
  currentQuestion = 0;

  showQuestion();
}

function showQuestion() {
  if (!questions.length) return;

  const question = questions[currentQuestion];

  document.getElementById("questionNumber").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  document.getElementById("questionText").textContent = question;

  document.getElementById("answerBox").value =
    answers[currentQuestion] || "";

  document.getElementById("progress").style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;
}

// =====================================
// SAVE ANSWER
// =====================================

function saveAnswer() {
  const answer = document.getElementById("answerBox").value.trim();

  if (!answer) {
    alert("Please enter your answer or skip this question.");
    return false;
  }

  answers[currentQuestion] = answer;
  skipped.delete(currentQuestion);

  return true;
}

// =====================================
// NEXT QUESTION
// =====================================

function nextQuestion() {
  if (!saveAnswer()) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    alert("All questions completed. Review and submit your interview.");
  }
}

// =====================================
// PREVIOUS QUESTION
// =====================================

function previousQuestion() {
  if (currentQuestion > 0) {
    const answer = document.getElementById("answerBox").value.trim();

    if (answer) {
      answers[currentQuestion] = answer;
      skipped.delete(currentQuestion);
    }

    currentQuestion--;
    showQuestion();
  }
}

// =====================================
// SKIP QUESTION
// =====================================

function skipQuestion() {
  answers[currentQuestion] = "";
  skipped.add(currentQuestion);

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    alert("You have reached the last question.");
  }
}

// =====================================
// SUBMIT INTERVIEW
// =====================================

function submitInterview() {
  const answer = document.getElementById("answerBox").value.trim();

  if (answer) {
    answers[currentQuestion] = answer;
    skipped.delete(currentQuestion);
  }

  const unanswered = questions.filter(
    (_, index) =>
      !answers[index] && !skipped.has(index)
  );

  if (unanswered.length > 0) {
    alert(`${unanswered.length} questions are not answered or skipped.`);
    return;
  }

  const actualAnswers = questions.map((question, index) => ({
    question,
    answer: answers[index] || null,
    status: skipped.has(index) ? "Skipped" : "Answered"
  }));

  console.log("Interview submission:", actualAnswers);

  alert("Interview ready for backend submission.");

  // Send actualAnswers to your backend API
  // Do not generate scores on the frontend.
}

// =====================================
// WEBCAM AND MICROPHONE
// =====================================

let mediaStream = null;

async function startCamera() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    const video = document.getElementById("webcamVideo");
    video.srcObject = mediaStream;

    alert("Camera and microphone enabled!");
  } catch (error) {
    alert("Please allow camera and microphone permissions.");
    console.error(error);
  }
}

function stopCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }

  const video = document.getElementById("webcamVideo");

  if (video) {
    video.srcObject = null;
  }
}

function toggleMicrophone() {
  if (!mediaStream) return;

  const audioTracks = mediaStream.getAudioTracks();

  audioTracks.forEach(track => {
    track.enabled = !track.enabled;
  });
}

// =====================================
// PAGE PROTECTION
// =====================================

function checkLogin() {
  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    window.location.href = "index.html";
  }
}
