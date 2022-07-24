const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("../JWT/jwt")


const register =  async (req,res,err)=> {
    const checkMail = await User.findOne({email:req.body.email})
    if (checkMail) {
        res.status(404).json("Exist E-Mail Adress")
    }else {
        try{
            //generate new password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password,salt)
            //create new user
            const newUser = new User({
                username:req.body.username,
                email:req.body.email,
                password:hashedPassword
            })
            //save user and return
            const user = await newUser.save()
            res.status(200).json(user,)
        } catch(error) 
        {
                console.log(error)
        }
    }
    }


    const login =  async (req,res)=>{
        try {
            const user = await User.findOne({ email:req.body.email });
            !user && res.status(404).json("not found");
            const validPassword = await bcrypt.compare(req.body.password,user.password)
            !validPassword && res.status(404).json("wrong password")
            const accessToken = jwt.generateAccessToken(user);
             const refreshToken = jwt.generateRefreshToken(accessToken);
            res.status(200).json({
                userId:user.id,
                accesToken:accessToken,
                refreshToken:refreshToken
            })
        } catch (error) {
            res.status(404)
        }
    }


   const logout = async (req, res) => {
      const refreshToken = req.body.token;
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        res.status(200).json("You logged out successfully.");
     }

    module.exports = {
        register,
        login,
        logout

    }