import {Router as route} from "express";

const router = route();

console.log(process.env.SALT)
/**
 * GET home page
 */
router.get('/', (req, res) => {
  const data = {
    userData: "from the server"
  }
  res.send(data)
});

export default router;
