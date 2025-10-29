let authorized = (roles) => {
  return async (req, res, next) => {
    try {
      let _id = req._id;

      let result = await User.findById(_id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      let tokenRole = result.role;
      if (roles.includes(tokenRole)) {
        next();
      } else {
        let error = new Error("You are not authorized to access this route");
        error.status = 403;
        throw error;
      }
    } catch (error) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to access this route",
      });
    }
  };
};
export default authorized;
