const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
    deadline: { type: Date },
    isImportant: { type: Boolean, default: false },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Field to store collaborators
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);
