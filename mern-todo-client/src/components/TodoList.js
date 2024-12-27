import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TodoList.css'; // Import the CSS file

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [newCollaborator, setNewCollaborator] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  // Fetch todos from the backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/todo', {
          headers: { Authorization: token },
        });
        setTodos(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTodos();
  }, []);

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/todo',
        { text: newTodo, deadline: newDeadline },
        { headers: { Authorization: token } }
      );
      setTodos([...todos, response.data]);
      setNewTodo('');
      setNewDeadline('');
    } catch (err) {
      console.log(err);
    }
  };

  // Mark a todo as completed
  const handleCompleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3001/api/todo/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (err) {
      console.log(err);
    }
  };

  // Edit a todo
  const handleEditTodo = async (id) => {
    const todo = todos.find((todo) => todo._id === id);
    setEditingTodo(id);
    setEditText(todo.text);
    setEditDeadline(todo.deadline || '');
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3001/api/todo/${id}/edit`,
        { text: editText, deadline: editDeadline, done : false },
        { headers: { Authorization: token } }
      );
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
      setEditText('');
      setEditDeadline('');
    } catch (err) {
      console.log(err);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/todo/${id}`, {
        headers: { Authorization: token },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // Mark Todo as Important
  const handleImportantTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3001/api/todo/${id}/important`,
        {},
        { headers: { Authorization: token } }
      );
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (err) {
      console.log(err);
    }
  };

  // Add collaborator to todo
  const handleAddCollaborator = async (id, email) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3001/api/todo/${id}/collaborators`,
        { email },
        { headers: { Authorization: token } }
      );
      
      // Update the todo list in state with the new collaborator added
      setTodos(todos.map((todo) =>
        todo._id === id ? { ...todo, collaborators: [...todo.collaborators, { email }] } : todo
      ));
      
      // Clear the input after adding collaborator
      setNewCollaborator('');
    } catch (err) {
      alert(err.response.data.message);
      console.log(err);
    }
  };

  // Sort Todos by different criteria
  const handleSortTodos = (criteria) => {
    let sortedTodos = [...todos];

    if (criteria === 'important') {
      sortedTodos = sortedTodos.sort((a, b) => b.isImportant - a.isImportant);
    } else if (criteria === 'completed') {
      sortedTodos = sortedTodos.sort((a, b) => b.done - a.done);
    }

    setTodos(sortedTodos);
  };

  // Sort Todos by Deadline
  const handleSortByDeadline = () => {
    const sortedTodos = [...todos].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    setTodos(sortedTodos);
  };

  // Search Todos by text
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter todos based on search query
  const filteredTodos = todos.filter(
    (todo) =>
      todo.text && // Check if the text property exists
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="todo-container">
      <div className="header">
        <h1 className="todo-header">Todo List</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          required
          className="todo-input"
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          className="date-picker"
        />
        <button type="submit" className="todo-button">Add</button>
      </form>

      <input
        type="text"
        placeholder="Search Todos"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="sort-buttons">
        <button onClick={() => handleSortTodos('important')}>Sort by Important</button>
        <button onClick={() => handleSortTodos('completed')}>Sort by Completed</button>
        <button onClick={handleSortByDeadline}>Sort by Deadline</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => {
          const isOverdue = todo.deadline && new Date(todo.deadline) < new Date();
          return (
            <li key={todo._id} className={`todo-item ${isOverdue ? 'overdue' : ''}`}>
              {editingTodo === todo._id ? (
                <div className="edit-todo">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(todo._id)}>Save</button>
                  <button onClick={() => setEditingTodo(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <span
                    className={`todo-text ${todo.done ? 'completed' : ''}`}
                    onClick={() => handleCompleteTodo(todo._id)}
                  >
                    {todo.text}
                  </span>
                  <span className="todo-deadline">
                    {todo.deadline ? new Date(todo.deadline).toLocaleDateString() : 'No Deadline'}
                  </span>
                  <div className="todo-buttons">
                    <button onClick={() => handleEditTodo(todo._id)}>Edit</button>
                    <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
                    <button onClick={() => handleImportantTodo(todo._id)}>
                      {todo.isImportant ? 'Unmark Important' : 'Mark Important'}
                    </button>
                  </div>
                  <div className="collaborators">
                    <h4>Collaborators:</h4>
                    <ul>
                      {todo.collaborators?.map((collaborator, index) => (
                        <li key={index}>{collaborator.email}</li> // Access the email property
                      ))}
                    </ul>
                    <input
                      type="email"
                      value={newCollaborator[todo._id] || ''}
                      onChange={(e) => setNewCollaborator({ ...newCollaborator, [todo._id]: e.target.value })}
                      placeholder="Add collaborator (email)"
                    />
                    <button onClick={() => handleAddCollaborator(todo._id, newCollaborator[todo._id])}>Add Collaborator</button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TodoList;
