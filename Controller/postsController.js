const Post = require("..//models/Post");
const User = require("../models/User");


const userGetPost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  }

const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
}

const updatePost = async (req,res)=>{
  try {
   const post = await Post.findById(req.params.id);
   if (post.userId === req.body.userId) {
       await post.updateOne({$set:req.body})
       res.status(200).json("the post updated")
   }else {
       res.status(404).json("not a your post")
   }
  } catch (error) {
   res.send("errorr")
  }
}

const deletePost = async(req,res)=>{
  const post = await Post.findById(req.params.id);
  if(req.body.userId ===  post.userId) {
      try {
          await Post.findByIdAndDelete(req.params.id);
          res.status(200).json("article has been deleted")
      } catch (error) {
          res.send("error")
      }
  }else {
      return res.status(401).json("you can delete only your postt")
  }
}

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

const timelineAll =  async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err);
  }
}

  module.exports = {
    userGetPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    timelineAll
  }