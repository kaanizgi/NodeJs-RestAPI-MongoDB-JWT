const router = require("express").Router();
const postController = require("../Controller/postsController");
const jwt = require("../JWT/jwt");



//get a post
router.get("/:id",jwt.verify,postController.userGetPost);

//create a post

router.post("/",jwt.verify,postController.createPost);

//update a post
router.put("/:id", postController.updatePost);

//delete a post

router.delete("/:id",postController.deletePost);

//like a post
router.put("/:id/like", postController.likePost);

router.get("/timeline/all",postController.timelineAll);
//get timeline posts

module.exports = router