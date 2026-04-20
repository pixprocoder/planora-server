import express from "express";
import { categoryRouter } from "../modules/category/category.route";
import { eventRouter } from "../modules/event/event.route";
import { joinRequestRouter } from "../modules/joinRequest/joinRequest.route";
import { userRouter } from "../modules/user/user.route";
import { reviewRouter } from "../modules/review/review.route";

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
  {
    path: "/categories",
    route: categoryRouter,
  },
  {
    path: "/join-requests",
    route: joinRequestRouter,
  },
  {
    path: "/reviews",
    route: reviewRouter,
  },
];


moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
