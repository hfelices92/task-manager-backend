import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

// Import controllers

router.post(
  "/create-account",
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
  "/confirm-account",
  body("token").notEmpty().withMessage("El token es obligatorio"),
  handleInputErrors,
  AuthController.confirmUser
);

router.post("/login", 
  body("email").isEmail().withMessage("El email no es válido"),
  body("password").notEmpty().withMessage("El password es obligatorio"),
  handleInputErrors,
    
  AuthController.loginUser);

router.post(
  "/request-confirmation-code",
  body("email").isEmail().withMessage("El email no es válido"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);


router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("El email no es válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/check-token",
  body("token").notEmpty().withMessage("El token es obligatorio"),
  handleInputErrors,
  AuthController.checkToken
);

router.post(
  "/reset-password/:token",
  param('token').isNumeric().withMessage("Token inválido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El nuevo password debe tener al menos 8 caracteres"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas deben coincidir");
    }
    return true;
  }
  ),
  handleInputErrors,
  AuthController.resetPassword
);


router.get('/user',
  authenticate,
  AuthController.user

)

// ------------ Profile ----------------

router.put('/profile',
  authenticate,
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El email no es válido"),
  handleInputErrors,
  AuthController.updateProfile
)

router.post('/change-password',
  authenticate,
  body("currentPassword").notEmpty().withMessage("El password actual es obligatorio"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("El nuevo password debe tener al menos 8 caracteres"),
  body("newPasswordConfirmation").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Las contraseñas deben coincidir");
    }
    return true;
  }
  ),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
)

router.post('/check-password',
  authenticate,
  body("password").notEmpty().withMessage("El password es obligatorio"),
  handleInputErrors,
  AuthController.checkPassword
)

export default router;
