const router = require("express").Router();
const authController = require("../Controller/authController");
const jwt = require("../JWT/jwt")


    //Register
    router.post ("/register",authController.register)

    //Login
    router.post("/login",authController.login)

    //Logout
    router.post("/logout",jwt.verify,authController.logout)

    router.post("refreshtoken",jwt.refreshToken)
    

    module.exports = router



    