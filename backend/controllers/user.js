const { UnauthorizedError } = require("../helper/customErrors");
const { bcryptHash } = require("../helper/bcrypt");
const User = require("../entities/user.entity");
const AppDataSource = require("../db.config.js");

//* Current User
const currentUser = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne(loggedUser.id);
    if (!user) throw new UnauthorizedError();

    user.email = req.headers.email;
    delete req.headers.email;

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

//* Update User
const updateUser = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne(loggedUser.id);
    if (!user) throw new UnauthorizedError();

    const {
      user: { password },
      user: userData,
    } = req.body;

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && key !== "password") user[key] = value;
    });

    if (password !== undefined && password !== "") {
      user.password = await bcryptHash(password);
    }

    await userRepository.save(user);

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { currentUser, updateUser };
