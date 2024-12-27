const express = require('express');
const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');
const User = require('../models/user');

const router = express.Router();
const nodemailer = require('nodemailer');

// Email configuration
const sendEmailNotification = async (collaboratorEmail, todoText) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'add email here,
      pass: 'Add web application password from your gmail'
    }
  });

  const mailOptions = {
    from: 'add email here',
    to: collaboratorEmail,
    subject: 'Collaborator Notification',
    text: `You have been added as a collaborator for the Todo: "${todoText}".`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${collaboratorEmail}`);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Routes

// Get todos with populated collaborators
router.get('/', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId })
      .populate('collaborators', 'email') // Populate collaborators
      .exec();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new Todo
router.post('/', authenticate, async (req, res) => {
  const { text, deadline } = req.body;

  try {
    const newTodo = new Todo({
      userId: req.userId,
      text,
      deadline: deadline ? new Date(deadline) : null
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark Todo as done
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { done: true },
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add collaborator
router.put('/:id/collaborators', authenticate, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const collaborator = await User.findOne({ email });

    if (!collaborator) {
      return res.status(404).json({ message: 'Collaborator not found' });
    }

    const todo = await Todo.findOne({ _id: id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if collaborator already exists in the todo's collaborators list
    if (todo.collaborators.includes(collaborator._id)) {
      return res.status(400).json({ message: 'Collaborator already added' });
    }

    // Add collaborator to todo
    todo.collaborators.push(collaborator._id);
    await todo.save();

    // Send email notification
    await sendEmailNotification(collaborator.email, todo.text);

    // Get updated list of todos
    const todos = await Todo.find({ userId: req.userId })
      .populate('collaborators', 'email')
      .exec();

    // Send updated todos in response
    res.json(todos);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete a todo
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findOneAndDelete({ _id: id, userId: req.userId });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle importance
router.put('/:id/important', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ _id: id, userId: req.userId });
    todo.isImportant = !todo.isImportant;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit a todo
router.put('/:id/edit', authenticate, async (req, res) => {
  const { text, done, deadline } = req.body;
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { text, done, deadline: deadline ? new Date(deadline) : null },
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
