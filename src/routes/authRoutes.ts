import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

// Import controllers

router.post(
  "/create-user",
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El email no es válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password debe tener al menos 8 caracteres"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas deben coincidir");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.createUser
);

router.post(
  "/confirm-user",
  body("token").notEmpty().withMessage("El token es obligatorio"),
  handleInputErrors,
  AuthController.confirmUser
);

router.post("/login", 
  body("email").isEmail().withMessage("El email no es válido"),
  body("password").notEmpty().withMessage("El password es obligatorio"),
  handleInputErrors,
    
  AuthController.loginUser);

export default router;
