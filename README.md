# Student Portal - Quiz Management System

## Project Overview

This project is a Student Portal with a focus on Quiz Management. It allows administrators to create quizzes, assign them to students, and view the results. Students can take quizzes and view their scores. The system includes video recording functionality for quiz sessions.

## Features

1. User Authentication (Admin and Student roles)
2. Quiz Creation and Management (Admin)
3. Quiz Assignment to Students (Admin)
4. Quiz Taking with Video Recording (Student)
   - Utilizes RecordRTC for high-quality video capture
5. Result Viewing (Admin and Student)
6. Student Management (Admin)
7. Date and Time Formatting using Moment.js

## Technology Stack

### Frontend
- Vue.js 3
- Vuex for state management
- Vue Router for navigation
- Axios for API requests
- Bootstrap 5 for styling





## Setup Instructions

### Prerequisites
- Node.js
- npm

### Frontend Setup
1. Navigate to the `portal-frontend` directory
2. Run `npm i` or `npm install` to install dependencies, including Moment.js and RecordRTC
3. Create a `.env` file and set the `VUE_APP_API_URL` to your backend URL
4. Run `npm run serve` to start the development server



## API Endpoints
- `/api/login` - User authentication
- `/api/apply` - Student application submission
- `/api/students` - Student management
- `/api/quizzes` - Quiz management
- `/api/assign-quiz` - Assign quizzes to students
- `/api/submit-quiz` - Submit completed quizzes
- `/api/view-results` - View quiz results
- `/api/recording` - Fetch quiz session recordings
- `/api/profile` - User profile management
- `/api/change-password` - Password change functionality
- `/api/forgot-password` - Password reset request
- `/api/reset-password` - Password reset confirmation

## Key Components

1. `LoginComponent.vue` - Handles user authentication
2. `DashboardComponent.vue` - Main dashboard for users
3. `AttemptQuizComponent.vue` - Quiz taking interface for students
4. `StudentResult.vue` - Displays quiz results for admins
5. `AssignQuizComponent.vue` - Interface for admins to assign quizzes to students
6. `QuizCreationComponent.vue` - Allows admins to create and edit quizzes
7. `StudentManagementComponent.vue` - Enables admins to manage student accounts
8. `ProfileComponent.vue` - User profile management for both admins and students
9. `SuccessPopup.vue` and `ErrorPopup.vue` - Reusable components for displaying success and error messages
10. `NavbarComponent.vue` - Navigation bar for easy access to different sections of the application


## Video Recording Feature

The system uses RecordRTC, a comprehensive WebRTC library, to capture high-quality video during quiz sessions. This ensures compatibility across different browsers and provides additional features like pause/resume recording. The recordings are sent to the server and can be reviewed by administrators.

## Security Considerations

- All API requests (except login, apply) require a valid JWT token
- Video recordings are stored securely and accessed only through authenticated requests
- Input validation is performed on both client and server sides

## Future Enhancements

1. Real-time notifications for quiz assignments and results
2. Analytics dashboard for administrators
3. Integration with external learning management systems




