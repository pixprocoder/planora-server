import express from "express";
import { userRouter } from "../modules/user/user.route";
import { eventRouter } from "../modules/event/event.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/events",
    route: eventRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

