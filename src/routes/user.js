import {Router as route} from "express";

const router = route();

/**
 * GET home page
 */
router.get('/', (req, res) => {
  res.send("home")
});

export default router;
