const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

let refreshTokens = [];

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, `${process.env.SECRET_KEY}`, {
        expiresIn: "10h",
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, `${process.env.SECRET_KEY}`);
};


const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, `${process.env.SECRET_KEY}`, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json("You are not authenticated!");
    }
};

const refreshToken = (req, res) => {
    //take the refresh token from the user
    const refreshToken = req.body.token;
  
    //send error if there is no token or it's invalid
    if (!refreshToken) return res.status(401).json("You are not authenticated!");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid!");
    }
    jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
      err && console.log(err);
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
  
      refreshTokens.push(newRefreshToken);
  
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
}

module.exports = {
    generateAccessToken, generateRefreshToken,verify,refreshToken
}
