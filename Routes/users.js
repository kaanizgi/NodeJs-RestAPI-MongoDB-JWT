const router = require("express").Router();
const userController = require("../Controller/userController")

//get one useer
router.get("/:id",userController.getUser);


//update user
router.put("/:id",userController.updateUser)

//delete
router.delete("/:id",userController.deletePost)


//follow a user
router.put("/:id/follow", userController.followUser);
  
//unfollow a user
router.put("/:id/unfollow", userController.unfollowerUser);

//timeline
router.get("/timeline/all", userController.timeline);


module.exports = router