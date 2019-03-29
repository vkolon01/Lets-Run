const jwt = require("jsonwebtoken");

var User = require('../models/user_model');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    
    const user = await User.findById(decodedToken.userId);

    console.log('user.role');
    console.log(user.role);
    

    req.userData = { email: decodedToken.email, userId: decodedToken.userId, userRole:  user.role};
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
