import { Router } from "express";
import { createUser, deleteSpecificUser, forgotPassword, loginUser, myProfile, readAllUser, readSpecificUser, resetPassword, updatePassword, updateProfile, updateSpecificUser, verifyEmail } from "../controller/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import authorized from "../middleware/authorized.js";

const userRouter = Router();

userRouter.route("/")
.post(createUser)
.get(readAllUser);

userRouter.route("/verify-email")
.patch(verifyEmail);

userRouter.route("/login")
.post(loginUser)

userRouter.route("/my-profile").get(isAuthenticated, myProfile);

userRouter.route("/update-profile").patch(isAuthenticated, updateProfile);

userRouter.route("/update-password").patch(isAuthenticated, updatePassword);

userRouter.route("/forgot-password").post(forgotPassword);

userRouter.route("/reset-password").patch(resetPassword);

userRouter.route("/:id")
.get(isAuthenticated, authorized(["admin", "superadmin"]), readSpecificUser)
.patch(isAuthenticated, authorized(["admin", "superadmin"]), updateSpecificUser)
.delete(isAuthenticated, authorized(["superadmin"]), deleteSpecificUser);

export default userRouter;
