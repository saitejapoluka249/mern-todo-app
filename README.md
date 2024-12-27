# MERN Todo App  

A full-stack Todo application built using the **MERN** (MongoDB, Express, React, Node.js) stack. This application includes features for user authentication, task management, collaboration, and notification.

---

## Features  

### Core Features  
- **User Authentication**  
  - **Login** and **Register** functionality with secure password storage using hashing.  
  - Token-based authentication using **JWT**.  

- **Todo Management**  
  - Add new todos with an intuitive interface.  
  - Edit existing todos.  
  - Mark todos as **completed** or **important**.  
  - Delete todos.  
  - Sort todos by **date**, **completion status**, or **importance**.  
  - Search todos by text.  

- **Collaborators**  
  - Add collaborators' email addresses to a todo.  
  - Send an email notification to collaborators when added to a todo.  

### Additional Functionalities  
- Protected routes for authenticated users only.  
- Clean and responsive UI built with **React.js**.  
- RESTful API backend built with **Node.js** and **Express.js**.  
- Database integration using **MongoDB** with Mongoose ORM.  

---

## Technology Stack  

### Frontend  
- React.js (with React Router for navigation)  
- CSS for styling  

### Backend  
- Node.js  
- Express.js  
- Mongoose  

### Database  
- MongoDB (Cloud/Local)  

### Authentication  
- JSON Web Tokens (JWT)  

### Notifications  
- Emails sent to collaborators using **Nodemailer**  

---

## Installation  

### Prerequisites  
Ensure you have the following installed:  
- [Node.js](https://nodejs.org/)  
- [MongoDB](https://www.mongodb.com/) (Local or Cloud)  

### Steps  

1. **Clone the Repository**  
   ```bash  
   git clone https://github.com/saitejapoluka249/mern-todo-app.git
   cd mern-todo-app  
   ```  

2. **Install Dependencies**  
   - Backend:  
     ```bash  
     npm install  
     ```  
   - Frontend:  
     ```bash  
     cd ../mern-todo-client  
     npm install  
     ```  

3. **Environment Variables**  
   Create a `.env` file in the `backend` directory with the following:  
   ```env  
   PORT=3001  
   MONGO_URI=<your_mongodb_connection_string>  
   JWT_SECRET=<your_secret_key>  
   EMAIL_USER=<your_email_for_notifications>  
   EMAIL_PASS=<your_email_password_or_app_specific_password>  
   ```  

4. **Run the Application**  
   - Start the backend server:  
     ```bash  
     cd backend  
     npm start  
     ```  
   - Start the frontend:  
     ```bash  
     cd ../client  
     npm start  
     ```  

5. **Access the Application**  
   - Frontend: `http://localhost:3000`  
   - Backend: `http://localhost:3001`  

---

## API Endpoints  

### Authentication  
| Endpoint           | Method | Description           |  
|--------------------|--------|-----------------------|  
| `/api/auth/register` | POST   | Register a new user   |  
| `/api/auth/login`    | POST   | Login an existing user|  

### Todos  
| Endpoint                | Method | Description                          |  
|-------------------------|--------|--------------------------------------|  
| `/api/todo`             | GET    | Get all todos for the logged-in user |  
| `/api/todo`             | POST   | Create a new todo                    |  
| `/api/todo/:id/edit`    | PUT    | Edit a todo                          |  
| `/api/todo/:id`         | DELETE | Delete a todo                        |  
| `/api/todo/:id`         | PUT    | Mark a todo as completed             |  
| `/api/todo/:id/important` | PUT  | Mark a todo as important             |  

### Collaborators  
| Endpoint                    | Method | Description                              |  
|-----------------------------|--------|------------------------------------------|  
| `/api/todo/:id/collaborate` | POST   | Add a collaborator to a todo and send an email notification |  

---

## Project Structure  

```plaintext  
mern-todo-app/  
│   ├── models/         # Mongoose schemas (Todo, User)  
│   ├── routes/         # API routes (Auth, Todo)  
│   ├── app.js       # Main server file  
│   └── .env            # Environment variables  
├── mern-todo-client/  
│   ├── src/            # React components and pages  
│   ├── public/         # Static files  
│   ├── App.js          # Main React App file  
│   └── index.js        # Entry point for React  
└── README.md           # Documentation  
```  

---

## Future Improvements  

- Add **password reset** functionality.  
- Implement **real-time updates** for todos using WebSockets.  
- Add due dates and reminders for todos.  
- Allow sorting and searching for collaborators.  
- Enhance the UI/UX with animations and themes.  

---

## Contributing  

Contributions are welcome! Fork the repository and submit a pull request with your changes.  

---

## License  

This project is licensed under the MIT License.  

---

## Acknowledgments  

- **React Router** for seamless navigation.  
- **JWT** for secure authentication.  
- **Nodemailer** for email notifications.  
- **MERN Stack** for a robust full-stack development experience.  
