import express, { Router } from "express";
import { getUserCount } from "../users";
var router = express.Router();

router.route("/").get(async (req, res) => {
  let userCount = getUserCount();
  res.render("index", { userCount });
});
export default router;
