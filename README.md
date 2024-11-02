# Productivity App - Frontend

Productivity App is a user-friendly task management platform that enables users to organize tasks, follow other users' content, and interact through comments. Built with React, this application offers a streamlined and interactive experience for managing personal productivity and staying connected with other users.

![am i responsive](https://your-image-link-here)

### Portfolio Project - Full-Stack Web Application (React & Django)

The purpose of this project was to create an interactive web application using React as the frontend framework. The app is designed to help users manage tasks efficiently while promoting social interactions through following and commenting features.

## Link to Application

The live version of the application is available at:
[Productivity App - Heroku](https://productivity-app-frontend-ea5313cc46b8.herokuapp.com)

## How to Use

In the Productivity App, users can log in to create tasks, view followed users' tasks, and engage with others through comments. Below are the primary features:

- **Register**: Create an account to start managing tasks and engaging with other users.
  ![register page](https://your-register-page-link)
  
- **Login**: Access your account to view your tasks and follow other users.
  ![login page](https://your-login-page-link)
  
- **Task Management**: Add new tasks, update their status, and delete them when completed.
  ![task management](https://your-task-page-link)
  
- **Follow Users**: Explore other users' tasks by following them.
  ![follow users](https://your-follow-page-link)
  
- **Comments**: Engage with other users by leaving comments on their tasks.
  ![comments](https://your-comments-page-link)

## Features
- **User Registration & Login**: Secure login and registration with JWT-based authentication.
- **Task CRUD Functionality**: Full CRUD (Create, Read, Update, Delete) operations for managing tasks.
- **Follow/Unfollow**: Users can follow others to view their tasks.
- **Comments**: Add comments on tasks to interact with other users.
- **Responsive Design**: Built using React Bootstrap for full responsiveness across devices.

## Technologies Used

- **Programming Languages**:
  - JavaScript (ES6)
  - HTML
  - CSS
- **Frontend Framework**:
  - React
- **UI Library**:
  - React Bootstrap for responsive and consistent styling
- **API Handling**:
  - Axios with interceptors for managing API requests and token refresh
- **Authentication**:
  - JWT-based authentication managed by Axios interceptors
- **Deployment**:
  - Heroku
- **Version Control**:
  - Git, GitHub for project tracking and version control

## UX Design & Development Decisions

### Colors & Fonts

The app uses a neutral color palette to provide a clean and minimalistic interface. Key colors are used to highlight important actions, such as task creation and user follow/unfollow options. Fonts were chosen for readability, with an emphasis on clear hierarchy in headings and content.

### Wireframes & Prototypes

Wireframes were designed to ensure a smooth user flow and logical information hierarchy. Each section is organized for easy navigation and quick access to the primary features, such as task creation, comments, and user interactions.

### Accessibility

Accessibility was a priority, with the app conforming to:
- High color contrast ratios for readability
- Proper ARIA labels and HTML elements for screen reader compatibility
- Clear, user-friendly error messages and feedback mechanisms

## Reusable Components

To ensure maintainability and modularity, the app utilizes several reusable components:

- **TaskItem**: Displays individual task details, with options for quick edits and deletion
- **TaskModal**: Modal for adding and editing tasks, including form validation
- **CommentList & CommentForm**: Modular components for viewing and adding comments to tasks
- **FollowedTasks**: Organized display of tasks from followed users in an accordion-style layout
- **PrivateRoute**: Handles private routing by checking if a user is authenticated
- **ErrorBoundary**: Catches any JavaScript errors in component trees and displays fallback UI

## Testing

The app went through extensive testing to ensure all features perform as expected, covering various test cases for CRUD operations, comments, user interactions, and API handling.

### Manual Testing

The following table summarizes the tests performed on various components of the Productivity App platform:

| Feature                | Expected Behavior          | Result  |
| ---------------------- |:--------------------------:| -------:|
| Register Button        | Clicking the "Register" button opens the registration form for a new user account. | Pass |
| Login Button           | Clicking the "Login" button opens the login form for existing users. | Pass |
| Task Creation          | Adding a new task updates the task list and is saved in the database. | Pass |
| Edit Task              | Editing a task reflects changes immediately on the frontend. | Pass |
| Delete Task            | Deleting a task removes it from the task list and database. | Pass |
| Follow User            | Clicking "Follow" allows users to follow other users. | Pass |
| Unfollow User          | Clicking "Unfollow" removes users from the followed list. | Pass |
| Comment on Task        | Adding a comment shows it below the task details. | Pass |
| Edit Comment           | Editing a comment updates it on the task detail page. | Pass |
| Delete Comment         | Deleting a comment removes it from the task detail page. | Pass |

### Validation

- **HTML Validation**: Passed through W3C HTML Validator with no significant errors.
- **CSS Validation**: Passed through W3C CSS Validator with no significant errors.
- **JavaScript Validation**: Validated using ESLint with adjustments made to ensure compatibility with ES6.

## Deployment

This project was deployed using Heroku.

### Steps for Deployment
1. Clone this repository.
2. Install all dependencies.
3. Create a Heroku app.
4. Link the Heroku app to your repository.
5. Set environment variables in Heroku for secure access to API and authentication tokens.
6. Deploy the application.

## Credits

- **Development**: Created by [Jorrit Vanstraelen]
- **Documentation**: Code Institute resources and documentation for deployment guidelines.
- **Inspiration**: Guided by various React and Django tutorials and documentation.

## Acknowledgements

Special thanks to my mentor for providing guidance throughout the development of this project.
