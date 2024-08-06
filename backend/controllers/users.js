const { getRepository } = require("typeorm");
const { jwtSign } = require("../helper/jwt");
const { bcryptHash, bcryptCompare } = require("../helper/bcrypt");
const {
  ValidationError,
  FieldRequiredError,
  AlreadyTakenError,
  NotFoundError,
} = require("../helper/customErrors");
const User = require("../entities/user.entity");
const AppDataSource = require("../db.config.js");

// Register
const signUp = async (req, res, next) => {
  try {
    const { username, email, bio, image, password } = req.body.user;
    if (!username) throw new FieldRequiredError(`A username`);
    if (!email) throw new FieldRequiredError(`An email`);
    if (!password) throw new FieldRequiredError(`A password`);

    const userRepository = AppDataSource.getRepository(User);
    const userExists = await userRepository.findOne({
      where: { email: email },
    });
    if (userExists) throw new AlreadyTakenError("Email", "try logging in");

    const newUser = userRepository.create({
      email: email,
      username: username,
      bio: bio,
      image: image,
      password: await bcryptHash(password),
    });

    await userRepository.save(newUser);
    newUser.token = await jwtSign(newUser);

    res.status(201).json({ user: newUser });
  } catch (error) {
    next(error);
  }
};

// Login
const signIn = async (req, res, next) => {
  try {
    const { user } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const existentUser = await userRepository.findOne({
      where: { email: user.email },
    });
    if (!existentUser) throw new NotFoundError("Email", "sign in first");

    const pwd = await bcryptCompare(user.password, existentUser.password);
    if (!pwd) throw new ValidationError("Wrong email/password combination");

    existentUser.token = await jwtSign(user);

    res.json({ user: existentUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn };
