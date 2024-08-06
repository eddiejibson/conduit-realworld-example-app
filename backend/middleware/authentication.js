const { NotFoundError } = require("../helper/customErrors");
const { jwtVerify } = require("../helper/jwt");
const User = require("../entities/user.entity");
const AppDataSource = require("../db.config.js");

const verifyToken = async (req, res, next) => {
  try {
    const { headers } = req;
    if (!headers.authorization) return next();

    const token = headers.authorization.split(" ")[1];
    if (!token) throw new SyntaxError("Token missing or malformed");

    const userVerified = await jwtVerify(token);
    if (!userVerified) throw new Error("Invalid Token");

    const userRepository = AppDataSource.getRepository(User);
    req.loggedUser = await userRepository.findOne({
      where: { email: userVerified.email },
      select: ["id", "username", "bio", "image"],
    });

    if (!req.loggedUser) next(new NotFoundError("User"));

    headers.email = userVerified.email;
    req.loggedUser.token = token;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
