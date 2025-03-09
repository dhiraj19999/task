import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import Project from "../models/Projectmodel.js";
import Task from "../models/TaskModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import multer from 'multer'
import Comment from "../models/CommentModel.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name for the current module (i.e., this file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//  Register a new user
//  POST /api/users/register  

export const RegisterUser=async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash the password
    //  const salt = await bcrypt.genSalt(10);
     // const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = new User({
        name,
        email,
        password,
        role: role || "Member", // Default role is 'Member'
      });
  
      // Save user to DB
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };



  //  login a user
//  POST /api/users/login
// Login Controller
export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // 2️⃣ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // 3️⃣ Generate JWT Token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie('token', token, {
      httpOnly: true,  // Protects the cookie from being accessed by JavaScript (XSS protection)
      secure:false,  // Set to true in production, false in development
      sameSite: 'Strict',  // Prevents cross-site request forgery (CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expiration (7 days)
    });
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role,project:user.projects },
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//  Get user profile
export const getUserProfile = async (req, res) => {
  try {
    console.log(req.user);
    
    const user = await User.findById(req.user).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//  create project
export const createProject = async (req, res) => {
  try {
    const { name, tasks, teamMembers } = req.body;

    // Ensure the logged-in user is an admin or has necessary permissions to create a project
    /*if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ message: "Access forbidden: Insufficient permissions." });
    }*/

    // Create the new project
    const newProject = new Project({
      name,
      tasks,
      teamMembers,
    });

    newProject.teamMembers.push(req.user);  // Add the project owner to the team members
    // Save the project
    await newProject.save();

    // Add the project to the users' team members (optional)
    await User.updateMany(
      { _id: { $in: teamMembers } },
      { $push: { projects: newProject._id } }
    );

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error" });
  }
};








// Add users to a project
export const addUsersToProject = async (req, res) => {
  try {
    const { projectId, userIds } = req.body;

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Add users to the project’s team members
    project.teamMembers.push(...userIds);

    await project.save();

    // Optionally, add the project to the users' project list
    await User.updateMany(
      { _id: { $in: userIds } },
      { $push: { projects: projectId } }
    );

    res.status(200).json({ message: "Users added to project", project });
  } catch (error) {
    console.error("Error adding users to project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove users from a project
export const removeUsersFromProject = async (req, res) => {
  try {
    const { projectId, userIds } = req.body;

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove users from the project's team members
    project.teamMembers = project.teamMembers.filter(
      (userId) => !userIds.includes(userId.toString())
    );

    await project.save();

    // Optionally, remove the project from the users' project list
    await User.updateMany(
      { _id: { $in: userIds } },
      { $pull: { projects: projectId } }
    );

    res.status(200).json({ message: "Users removed from project", project });
  } catch (error) {
    console.error("Error removing users from project:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//  Retrive project

export const getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
console.log(req.params);

    // Find the project by ID and populate the necessary fields (teamMembers and tasks)
    const project = await Project.findById(id)
      .populate("teamMembers", "name email role")  // Populate team members with basic info
      .populate("tasks", "title status priority dueDate")  // Populate tasks with basic info
      .exec();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error retrieving project details:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//  assigns user to project
export const assignUsersToProject = async (req, res) => {
  try {
    const { id } = req.params;  // Project ID from route params
    const { userIds } = req.body;  // Array of user IDs to add to the project

    // Ensure that all user IDs are valid
    const users = await User.find({ '_id': { $in: userIds } });

    if (users.length !== userIds.length) {
      return res.status(404).json({ message: "Some users not found" });
    }

    // Find the project and add the users to the teamMembers field
    const project = await Project.findByIdAndUpdate(
      id,
      {
        $addToSet: { teamMembers: { $each: userIds } },  // Use $addToSet to avoid duplicates
      },
      { new: true }  // Return the updated project
    ).populate("teamMembers", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error assigning users to project:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//  create task
export const createTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, assignee } = req.body;

    // Ensure the project exists
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // Check if a task with the same title already exists in the same project

    const existingTask = await Task.findOne({ title, project });
    if (existingTask) {
      return res.status(400).json({ message: "A task with this title already exists in the project." });
    }
    // Create the task
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      assignee,
      project: id,
      reporter: req.user // Assuming the user is authenticated and `req.user` has the user info
    });

    // Save the task
    await newTask.save();

    // Add task to the project
    project.tasks.push(newTask);
    await project.save();

    res.status(201).json({ task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//  retrive task by project id

export const getTasksByProject = async (req, res) => {
  try {
    //const { id } = req.params;

    // Find the project and populate tasks with assignee and reporter
    // find task by reportee
       console.log(req.user);
      const task= await Task.find({
        reporter:req.user});
      console.log(task);
    /*const project = await Project.findById(id)
      .populate({
        path: "tasks",
        populate: [
          { path: "assignee", select: "name email" },
          { path: "reporter", select: "name email" }
        ]
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
*/
    res.status(200).json({ tasks: task});
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//  update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["To-Do", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the task
    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }  // Return the updated task
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// Controller to add comment to task
export const addCommentToTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Find task and create comment
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newComment = new Comment({
      content,
      user: req.user,  // Assuming the user is authenticated
      task: id
    });

    await newComment.save();

    // Add comment to task's comments field
    task.comments.push(newComment);
    await task.save();

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// project Report

// Controller to generate project summary
export const generateProjectSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate("tasks")
      .populate("teamMembers", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const summary = {
      projectName: project.name,
      teamMembers: project.teamMembers,
      tasks: project.tasks,
    };

    const uploadsDir = path.join(__dirname, 'uploads');
    const summaryFilePath = path.join(uploadsDir, `project-summary-${id}-${Date.now()}.json`);

    // Ensure the 'uploads' directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });  // Create the directory if it doesn't exist
    }

    // Write the project summary data to the JSON file
    fs.writeFileSync(summaryFilePath, JSON.stringify(summary, null, 2));
    // Send the file for download
    res.download(summaryFilePath, `project-summary-${id}.json`, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
      } else {
        fs.unlinkSync(summaryFilePath); // Delete the file after download
      }
    })
    
  } catch (error) {
    console.error("Error generating project summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// attach file to task
// Set up multer for file uploads




// Define the upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Check if the directory exists, and create it if it doesn't
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Set the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// Route to attach a file to a task
export const attachFileToTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task by ID
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Add file to task
    task.files.push(req.file.path);  // Store the file path in task
    await task.save();

    // Return a success response with the file information
    res.status(200).json({ file: req.file });
  } catch (error) {
    console.error("Error attaching file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export multer middleware for use in the route
export const uploadMiddleware = upload.single('file');



export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user // Get user ID from decoded JWT token
    console.log(userId);
    

    // Fetch tasks assigned to this user
    const tasks = await Task.find({ 
      
      assignee
: userId });
      console.log(tasks);
      

    if (!tasks) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    res.status(200).json(tasks);  // Return the tasks assigned to the user
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};







export const getUserProjects = async (req, res) => {
  try {
  const userId = req.user; // Get user ID from decoded JWT token

    // Find projects where the user is the owner or a member
    const projects = await Project.find({ teamMembers: userId });

    if (!projects.length) {
      return res.status(404).json({ message: "No projects found for this user." });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ message: "Server error" });
  }
}






export  const getTaskbyId=async(req,res)=>{
  try {
    const { id } = req.params;
    const task = await  Task.findById (id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  }
  catch (error) {
    console.error("Error retrieving task details:", error);
    res.status(500).json({ message: "Server error" });
  }

}

