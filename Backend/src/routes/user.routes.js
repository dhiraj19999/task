import { Router } from "express";
import authenticate from "../Middleware/Auth.Middleware.js";
import { RegisterUser,LoginUser,getUserProfile,createProject,addUsersToProject,
    removeUsersFromProject,getProjectDetails,assignUsersToProject,createTask,getTasksByProject,
    updateTaskStatus,addCommentToTask,generateProjectSummary,attachFileToTask,uploadMiddleware,getUserTasks,getUserProjects,getTaskbyId} from "../controllers/user.controller.js";


const router = Router();

// User Registration Route
router.route("/register").post(RegisterUser); // testing done
router.route("/login").post(LoginUser); // testing done
router.route("/profile").get(authenticate,getUserProfile); // testing done
router.route("/createproject").post(authenticate,createProject); // testing done
router.route("/adduserstoproject").post(authenticate,addUsersToProject); // testing done
router.route("/removeusersfromproject").post(authenticate,removeUsersFromProject);// testing done
router.route("/project/:id").get(authenticate,getProjectDetails)// testing done;
router.route("/assignuserstoproject/:id").post(authenticate,assignUsersToProject);// testing done
router.route("/createtask/:id").post(authenticate,createTask);// testing done
router.route("/updatetaskstatus/:id").put(authenticate,updateTaskStatus);// testing done
router.route("/tasks").get(authenticate,getTasksByProject); // testing done
router.route("/addcommenttotask/:id").post(authenticate,addCommentToTask);// testing done
router.route("/generateprojectsummary/:id").get(authenticate,generateProjectSummary); // testing done
router.route("/attachfiletotask/:id").post(authenticate,uploadMiddleware,attachFileToTask); // testing done
router.route("/usertasks").get(authenticate,getUserTasks); // testing done
router.route("/userprojects").get(authenticate,getUserProjects); // testing done
router.route("/task/:id").get(authenticate,getTaskbyId); // testing done
export default router;