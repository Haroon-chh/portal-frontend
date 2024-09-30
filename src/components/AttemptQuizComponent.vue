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
    <div v-if="quizStarted" class="modal d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ quiz.title }}</h5>
            <div class="timer-container">
              <i class="bi bi-clock me-2"></i>
              <span class="timer">Time Remaining: {{ formatTime(timeRemaining) }}</span>
            </div>
          </div>
          <div class="modal-body">
            <h5>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</h5>
            <p>{{ currentQuestion.question }}</p>
            <div v-for="(option, key) in currentQuestion.options" :key="key" class="form-check">
              <input
                class="form-check-input"
                type="radio"
                :id="`q${currentQuestionIndex}_${key}`"
                :name="`question${currentQuestionIndex}`"
                :value="key"
                v-model="userAnswers[currentQuestionIndex]"
              >
              <label class="form-check-label" :for="`q${currentQuestionIndex}_${key}`">
                {{ option }}
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              class="btn btn-primary" 
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
    <div v-if="quizCompleted" class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Quiz Completed</h5>
          </div>
          <div class="modal-body">
            <p>Your score: {{ score }}%</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="closeQuiz">Close</button>
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
</style>