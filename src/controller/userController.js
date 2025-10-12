import { secretkey } from "../constant.js";
import { sendEmail } from "../utils/sendMail.js";
import bcrypt, { hash } from "bcrypt";
import User from "../schema/userSchema.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
  try {
    let data = req.body;
    let hashPassword = await bcrypt.hash(data.password, 10);
    data = {
      ...data,
      isVerifiedEmail: false,
      password: hashPassword,
    };
    let result = await User.create(data);
    let infoObj = {
      _id: result._id,
    };
    let expiryInfo = {
      expiresIn: "5d",
    };
    let token = await jwt.sign(infoObj, secretkey, expiryInfo);
    await sendEmail({
      from: "'Swikriti Ghimire'<swikrityghimire@gmail.com>",
      to: [data.email],
      subject: "Account Created",
      html: `<h1> Your account has been created successfully. Please verify your email by clicking the link below</h1><a href="http://localhost:3000/verify-email?token=${token}">http://localhost:3000/verify-email?token=${token}</a>`,
    });
    res.status(200).json({
      success: true,
      message: "User created successfully. Please verify your email",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    let tokenString = req.headers.authorization;
    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1];

    let infoObj = await jwt.verify(token, secretkey);
    console.log(infoObj);
    let userId = infoObj._id;
    let result = await User.findByIdAndUpdate(
      userId,
      { isVerifiedEmail: true },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let user = await User.findOne({ email: email });
    if (user) {
      if (user.isVerifiedEmail) {
        let isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          let infoObj = {
            _id: user._id,
          };
          let expiryInfo = {
            expiresIn: "365d",
          };
          let token = await jwt.sign(infoObj, secretkey, expiryInfo);
          res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
            token: token,
          });
        } else {
          let error = new Error("Credential does not match. Please try again");
          throw error;
        }
      } else {
        let error = new Error(
          "Credential doesnot match. Please verify your email first"
        );
        throw error;
      }
    } else {
      let error = new Error("Credential does not match. Please try again");
      throw error;
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const myProfile = async (req, res, next) => {
  try {
    let _id = req._id;
    let result = await User.findById(_id);

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let _id = req._id;
    let data = req.body;

    delete data.email;
    delete data.password;

    let result = await User.findByIdAndUpdate(_id, data, { new: true });

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    let _id = req._id;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    let data = await User.findById(_id);
    let hashPassword = data.password;

    let isValidPassword = await bcrypt.compare(oldPassword, hashPassword);

    if (isValidPassword) {
      let newHashPassword = await bcrypt.hash(newPassword, 10);
      let result = await User.findByIdAndUpdate(
        _id,
        { password: newHashPassword },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        data: result,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const readAllUser = async (req, res, next) => {
  try {
    let result = await User.find({});

    res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const readSpecificUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let result = await User.findById(id);

    res.status(200).json({
      success: true,
      message: "Specific User data fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSpecificUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = req.body;

    delete data.email;
    delete data.password;

    let result = await User.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      success: true,
      message: "Specific User data updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSpecificUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let result = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Specific User data deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    let email = req.body.email;

    let result = await User.findOne({
      email: email,
    });
    if (result) {
      let infoObj = {
        _id: result._id,
      };
      let expiryInfo = {
        expiresIn: "5d",
      };
      let token = await jwt.sign(infoObj, secretkey, expiryInfo);
      await sendEmail({
        from: "'Swikriti Ghimire'<swikrityghimire@gmail.com>",
        to: email,
        subject: "Reset Password",
        html: `<h1> Please click the link below to reset your password</h1><a href="http://localhost:3000/reset-password?token=${token}">http://localhost:3000/reset-password?token=${token}</a>`,
      });

      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Email does not exist. Please try again",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    let _id = req._id;
    let hashPassword = await bcrypt.hash(req.body.password, 10);

    let result = await User.findByIdAndUpdate(
      _id,
      { password: hashPassword },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
