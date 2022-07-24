const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//get one useer
router.get("/:id",async (req,res)=>{
    try {
       const user =  await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json(error)
    }
});


//update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId ===  req.params.id) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt)

            } catch (error) {
                return res.json(error)
            }
        }
        try {
            
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(200).json("account has been updated")
        } catch (error) {
            res.send(error)
        }
    }else {
        return res.status(401).json("you can update only your account")
    }
})

//delete
router.delete("/:id",async(req,res)=>{
    if(req.body.id ===  req.params.id) {
        try {
            await User.findByIdAndDelete(req.body.id);
            res.status(200).json("account has been deleted")
        } catch (error) {
            res.send(error)
        }
    }else {
        return res.status(401).json("you can delete only your account")
    }
})


//follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  });
  
//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you allready unfollow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });


//timeline

router.get("/timeline/all", async (req, res) => {
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
});

  

module.exports = router