<template>
  <div class="container mt-4">
    <div v-if="!quizStarted && quiz">
      <h2 class="mb-4">{{ quiz.title }}</h2>
      <p>{{ quiz.description }}</p>
      
      <div class="row">
        <div class="col-md-8">
          <h3 class="mb-3">Instructions:</h3>
          <ul class="list-group">
            <li class="list-group-item"><i class="bi bi-camera-video me-2"></i>Please allow access to your camera and microphone before starting the quiz.</li>
            <li class="list-group-item"><i class="bi bi-record-circle me-2"></i>Your video will be recorded during the quiz session.</li>
            <li class="list-group-item"><i class="bi bi-wifi me-2"></i>Ensure you have a stable internet connection.</li>
            <li class="list-group-item"><i class="bi bi-window-desktop me-2"></i>Do not leave the quiz page or switch tabs during the quiz.</li>
            <li class="list-group-item"><i class="bi bi-pencil-square me-2"></i>Answer all questions to the best of your ability.</li>
          </ul>
        </div>
        <div class="col-md-4">
          <div class="card bg-light">
            <div class="card-body">
              <h5 class="card-title">Quiz Details</h5>
              <p class="card-text"><strong>Allowed Time:</strong> {{ formatTime(timeRemaining) }}</p>
            </div>
          </div>
        </div>
      </div>

      <button @click="startQuiz" class="btn btn-primary mt-4">Start Quiz</button>
    </div>

    <!-- Quiz Modal -->
    <div v-if="quizStarted" class="quiz-modal-overlay">
      <div class="timer-container-outside">
        <i class="bi bi-clock me-2"></i>
        <span class="timer">Time Remaining: {{ formatTime(timeRemaining) }}</span>
      </div>
      <div class="quiz-modal">
        <div class="quiz-modal-content">
          <div class="quiz-modal-header">
            <h3 class="quiz-modal-title">{{ quiz.title }}</h3>
          </div>
          <div class="quiz-modal-body">
            <h4>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</h4>
            <p class="question-text">{{ currentQuestion.question }}</p>
            <div class="options-container">
              <div v-for="(option, key) in currentQuestion.options" :key="key" class="option">
                <input
                  class="option-input"
                  type="radio"
                  :id="`q${currentQuestionIndex}_${key}`"
                  :name="`question${currentQuestionIndex}`"
                  :value="key"
                  v-model="userAnswers[currentQuestionIndex]"
                >
                <label class="option-label" :for="`q${currentQuestionIndex}_${key}`">
                  {{ option }}
                </label>
              </div>
            </div>
          </div>
          <div class="quiz-modal-footer">
            <button 
              class="btn btn-primary btn-lg" 
              @click="nextQuestion" 
              :disabled="!userAnswers[currentQuestionIndex]"
            >
              {{ isLastQuestion ? 'Finish Quiz' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Modal -->
    <div v-if="quizCompleted" class="result-modal-overlay">
      <div class="result-modal">
        <div class="result-modal-content">
          <div class="result-modal-header">
            <h2 class="result-modal-title">Quiz Completed</h2>
          </div>
          <div class="result-modal-body">
            <div class="score-container">
              <div class="score-circle">
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path class="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path class="circle"
                    :stroke-dasharray="`${score}, 100`"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" class="percentage">{{ score }}%</text>
                </svg>
              </div>
              <p class="score-label">Your Score</p>
            </div>
          </div>
          <div class="result-modal-footer">
            <button class="btn-close" @click="closeQuiz">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!quiz">
      <p>Loading quiz...</p>
    </div>

    <video ref="videoElement" style="display: none;"></video>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'AttemptQuizComponent',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const quiz = ref(null);
    const questions = ref([]);
    const quizStarted = ref(false);
    const quizCompleted = ref(false);
    const userAnswers = ref([]);
    const timeRemaining = ref(0);
    const videoElement = ref(null);
    const mediaRecorder = ref(null);
    const recordedChunks = ref([]);
    const currentQuestionIndex = ref(0);
    const score = ref(0);

    const quizId = parseInt(route.params.quizId);
    const assignmentId = parseInt(route.query.assignmentId);

    const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {});
    const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

    const fetchQuizData = async () => {
      try {
        const quizzesResponse = await axios.get(`${process.env.VUE_APP_API_URL}/quizzes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        const allQuizzes = quizzesResponse.data.data;
        const selectedQuiz = allQuizzes.find(q => q.id === quizId);

        if (!selectedQuiz) {
          throw new Error('Quiz not found');
        }

        const userId = store.getters.getLoggedUser.id;
        const assignedQuizzesResponse = await axios.get(`${process.env.VUE_APP_API_URL}/assigned-quizzes/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        const assignedQuizzes = assignedQuizzesResponse.data.data;
        const assignedQuiz = assignedQuizzes.find(aq => aq.id === assignmentId && aq.quiz_id === quizId);

        if (!assignedQuiz) {
          throw new Error('Assigned quiz not found');
        }

        quiz.value = {
          id: selectedQuiz.id,
          title: selectedQuiz.title,
          description: selectedQuiz.description,
          mcqs: selectedQuiz.mcqs,
        };
        questions.value = JSON.parse(quiz.value.mcqs);
        userAnswers.value = new Array(questions.value.length).fill('');
        timeRemaining.value = assignedQuiz.duration * 60; // Convert minutes to seconds
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    const startQuiz = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        quizStarted.value = true;
        startTimer();
        startRecording();
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Please allow access to your camera and microphone to start the quiz.');
      }
    };

    const nextQuestion = () => {
      if (isLastQuestion.value) {
        finishQuiz();
      } else {
        currentQuestionIndex.value++;
      }
    };

    const finishQuiz = () => {
      stopRecording();
      calculateScore();
      quizCompleted.value = true;
      quizStarted.value = false;
    };

    const calculateScore = () => {
      let correctAnswers = 0;
      questions.value.forEach((question, index) => {
        if (userAnswers.value[index] === question.ans) {
          correctAnswers++;
        }
      });
      score.value = Math.round((correctAnswers / questions.value.length) * 100);
    };

    const closeQuiz = () => {
      router.push({ name: 'Dashboard' });
    };

    const startTimer = () => {
      const timer = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value--;
        } else {
          clearInterval(timer);
          finishQuiz();
        }
      }, 1000);
    };

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoElement.value.srcObject = stream;
      mediaRecorder.value = new MediaRecorder(stream);

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.value.push(event.data);
        }
      };

      mediaRecorder.value.start();
    };

    const stopRecording = () => {
      if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
        mediaRecorder.value.stop();
      }
    };

    onMounted(() => {
      fetchQuizData();
    });

    onUnmounted(() => {
      stopRecording();
    });

    return {
      quiz,
      questions,
      quizStarted,
      quizCompleted,
      userAnswers,
      timeRemaining,
      videoElement,
      currentQuestionIndex,
      currentQuestion,
      isLastQuestion,
      score,
      startQuiz,
      nextQuestion,
      formatTime,
      closeQuiz,
    };
  }
};
</script>

<style scoped>
.list-group-item {
  display: flex;
  align-items: center;
}

.list-group-item i {
  font-size: 1.2rem;
  margin-right: 10px;
}

.timer-container {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.timer {
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
}

.bi-clock {
  font-size: 1.4rem;
  color: #007bff;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.quiz-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.timer-container-outside {
  position: fixed;
  top: 15%;
  left: 90%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1001;
}

.quiz-modal {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.quiz-modal-content {
  padding: 30px;
}

.quiz-modal-header {
  margin-bottom: 20px;
}

.quiz-modal-title {
  font-size: 24px;
  color: #333;
}

.quiz-modal-body {
  margin-bottom: 30px;
}

.question-text {
  font-size: 18px;
  margin-bottom: 20px;
}

.options-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.option {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
}

.option-input {
  margin-right: 10px;
}

.option-label {
  font-size: 16px;
  cursor: pointer;
}

.quiz-modal-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-lg {
  padding: 10px 30px;
  font-size: 18px;
}

.result-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.result-modal {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
}

.result-modal-content {
  padding: 30px;
}

.result-modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.result-modal-title {
  font-size: 24px;
  color: #333;
}

.result-modal-body {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.score-container {
  text-align: center;
}

.score-circle {
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
}

.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 80%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 2.8;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
  stroke: #4CAF50;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.percentage {
  fill: #333;
  font-family: sans-serif;
  font-size: 0.5em;
  text-anchor: middle;
}

.score-label {
  font-size: 18px;
  color: #666;
}

.result-modal-footer {
  text-align: center;
}

.btn-close {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-close:hover {
  background-color: #45a049;
}
</style>