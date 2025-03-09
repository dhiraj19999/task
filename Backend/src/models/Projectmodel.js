import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  }],
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;