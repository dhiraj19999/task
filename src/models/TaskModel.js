import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  status: {
    type: String,
    enum: ["To-Do", "In Progress", "Completed"],
    default: "To-Do",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
   files: [String], // Changed from ObjectId to String to store file paths
  
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  }],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
taskSchema.index({ title: 1, project: 1 }, { unique: true });

export default Task;