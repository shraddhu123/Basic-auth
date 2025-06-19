import express from "express"
import { loginController, profileController, protectedController, registerController, updateProfileController } from "../controllers/authController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import Roles from "../constants/index.js"
import registerValidator from "../validators/register-validator.js";
import loginValidator from "../validators/login-validator.js";
import profileUpdateValidator from "../validators/profileUpdate-validator.js";

const  router= express.Router();

// complete route...api/auth/register....
router.post("/register",registerValidator, registerController);

router.post("/login",loginValidator, loginController)
// complete route  ...api/auth/profile/ghgj4644gjjgj
router.get("/profile/:id",isAuthenticated, profileController)


router.put("/updateProfile",profileUpdateValidator, isAuthenticated, updateProfileController)

router.get(
    "/protected",
    isAuthenticated,
    isAuthorized([Roles.ADMIN,Roles.SUPER_ADMIN]),
    protectedController
)


export default router