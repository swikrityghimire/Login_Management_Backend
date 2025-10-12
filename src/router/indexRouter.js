import { Router } from "express";
import errorMiddleware from "../middleware/errorMiddleware.js";
import pageNotFound from "../middleware/pageNotFoundMiddleware.js";
import userRouter from "./userRouter.js";

const indexRouter = Router();

let apiRoute = [
  {
    path: "/users",
    route: userRouter,
  },
];

apiRoute.forEach((item, i) => {
  indexRouter.use(item.path, item.route);
});
indexRouter.use(pageNotFound);
indexRouter.use(errorMiddleware);

export default indexRouter;
