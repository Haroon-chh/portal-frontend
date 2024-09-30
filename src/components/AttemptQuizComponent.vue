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

    <div v-else-if="quizStarted && quiz">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>{{ quiz.title }}</h2>
        <div class="timer-container">
          <i class="bi bi-clock me-2"></i>
          <span class="timer">Time Remaining: {{ formatTime(timeRemaining) }}</span>
        </div>
      </div>

      <div v-for="(question, index) in questions" :key="index" class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Question {{ index + 1 }}</h5>
          <p class="card-text">{{ question.question }}</p>
          <div v-for="(option, key) in question.options" :key="key" class="form-check">
            <input
              class="form-check-input"
              type="radio"
              :id="`q${index}_${key}`"
              :name="`question${index}`"
              :value="key"
              v-model="userAnswers[index]"
            >
            <label class="form-check-label" :for="`q${index}_${key}`">
              {{ option }}
            </label>
          </div>
        </div>
      </div>

      <button @click="submitQuiz" class="btn btn-success">Submit Quiz</button>
    </div>

    <div v-else>
      <p>Loading quiz...</p>
    </div>

    <video ref="videoElement" style="display: none;"></video>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
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
    const userAnswers = ref([]);
    const timeRemaining = ref(0);
    const videoElement = ref(null);
    const mediaRecorder = ref(null);
    const recordedChunks = ref([]);

    const quizId = parseInt(route.params.quizId);
    const assignmentId = parseInt(route.query.assignmentId);

    const fetchQuizData = async () => {
      try {
        // Fetch all quizzes
        const quizzesResponse = await axios.get(`${process.env.VUE_APP_API_URL}/quizzes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        // Filter out the specific quiz
        const allQuizzes = quizzesResponse.data.data;
        const selectedQuiz = allQuizzes.find(q => q.id === quizId);

        if (!selectedQuiz) {
          throw new Error('Quiz not found');
        }

        // Fetch assigned quizzes for the student
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
        // Handle error (e.g., show error message, redirect to dashboard)
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

    const startTimer = () => {
      const timer = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value--;
        } else {
          clearInterval(timer);
          submitQuiz();
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

    const submitQuiz = async () => {
      stopRecording();
      const videoBlob = new Blob(recordedChunks.value, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('video', videoBlob, 'quiz_recording.webm');
      formData.append('answers', JSON.stringify(userAnswers.value));
      formData.append('assignment_id', assignmentId);

      try {
        await axios.post(`${process.env.VUE_APP_API_URL}/submit-quiz`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'multipart/form-data',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        // Handle successful submission (e.g., show success message, redirect to dashboard)
        router.push({ name: 'Dashboard' });
      } catch (error) {
        console.error('Error submitting quiz:', error);
        // Handle error (e.g., show error message)
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
      userAnswers,
      timeRemaining,
      videoElement,
      startQuiz,
      formatTime,
      submitQuiz,
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
</style>