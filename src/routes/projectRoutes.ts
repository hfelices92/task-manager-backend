import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { checkProjectExists } from "../middleware/project";
import { checkTaskBelongsToProject, checkTaskExists, hasAuthorization } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

// -------------------- PROJECTS --------------------

// Middleware global: siempre que haya ":id" o ":projectId", busca el proyecto
router.param("id", checkProjectExists);
router.param("projectId", checkProjectExists);

router.use(authenticate); // Proteger todas las rutas a partir de este punto
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
  ProjectController.getProjectById
);

router.put(
  "/:id",
  hasAuthorization,
  param("id").isMongoId().withMessage("Invalid project ID"),
  body("projectName").notEmpty().withMessage("Name is required"),
  body("clientName").notEmpty().withMessage("Client's name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  hasAuthorization,
  param("id").isMongoId().withMessage("Invalid project ID"),
  handleInputErrors,
  ProjectController.deleteProject
);

// -------------------- TASKS --------------------

// Middleware global: siempre que haya ":taskId", valida existencia y pertenencia
router.param("taskId", checkTaskExists);
router.param("taskId", checkTaskBelongsToProject);

router.post(
  "/:projectId/tasks",
  hasAuthorization,
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

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("Invalid task ID"),
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
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

// -------------------- TEAMS --------------------

router.post(
  "/:projectId/team/find",
  body("email").isEmail().withMessage("Valid email is required"),
  handleInputErrors,
  TeamController.findMemberByEmail
);

router.get("/:projectId/team", TeamController.getTeamMembers);

router.post(
  "/:projectId/team",
  body("memberId").notEmpty().withMessage("User ID is required"),
  body("memberId").isMongoId().withMessage("Valid user ID is required"),
  handleInputErrors,
  TeamController.addTeamMember
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("Valid user ID is required"),
 
  handleInputErrors,
  TeamController.removeTeamMember
);

// -------------------- NOTES --------------------

router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content").notEmpty().withMessage("Content is required"),
  handleInputErrors,
  NoteController.createNote
);

router.get(
  "/:projectId/tasks/:taskId/notes",
  handleInputErrors,
  NoteController.getNotes
);

router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",
  param("noteId").isMongoId().withMessage("Valid note ID is required"),
  handleInputErrors,
  NoteController.deleteNote
);
export default router;
