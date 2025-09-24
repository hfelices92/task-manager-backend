import { Router } from "express";
import { body, check, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import Task from "../models/Task";
import { TaskController } from "../controllers/TaskController";
import { checkProjectExists } from "../middleware/project";
import { checkTaskBelongsToProject, checkTaskExists } from "../middleware/task";

const router = Router();

router.post(
  "/",
  body("projectName").notEmpty().withMessage("Name is required"),
  body("clientName").notEmpty().withMessage("Client's name is required"),
  body("description").notEmpty().withMessage("Description is required"),

  handleInputErrors,

  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid project ID"),
  handleInputErrors,
  checkProjectExists,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Invalid project ID"),
  body("projectName").notEmpty().withMessage("Name is required"),
  body("clientName").notEmpty().withMessage("Client's name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid project ID"),
  handleInputErrors,
  checkProjectExists,
  ProjectController.deleteProject
);

// TASKS ROUTES

//Middleware to check if project exists
router.param("projectId", checkProjectExists);
router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),

  handleInputErrors,
  TaskController.createTask
);

router.get(
  "/:projectId/tasks",

  handleInputErrors,
  TaskController.getAllTasksByProjectId
);

//Middleware to check if task exists and belongs to project
router.param("taskId", checkTaskExists);
router.param("taskId", checkTaskBelongsToProject);
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  handleInputErrors,
  

  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),

  handleInputErrors,
  

  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  handleInputErrors,
  
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "onHold", "inProgress", "underReview", "completed"])
    .withMessage("Invalid status"),
    handleInputErrors,
    
  TaskController.updateTaskStatus
);
export default router;
