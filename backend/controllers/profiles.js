const { UnauthorizedError, NotFoundError } = require("../helper/customErrors");
const { appendFollowers } = require("../helper/helpers");
const User = require("../entities/user.entity");
const AppDataSource = require("../db.config.js");

//? Profile
const getProfile = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    const { username } = req.params;

    const userRepository = AppDataSource.getRepository(User);

    const profile = await userRepository.findOne({
      where: { username: username },
      select: ["id", "username", "bio", "image"],
    });
    if (!profile) throw new NotFoundError("User profile");

    await appendFollowers(loggedUser, profile);

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

//* Follow/Unfollow Profile
const followToggler = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { username } = req.params;

    const userRepository = AppDataSource.getRepository(User);

    const profile = await userRepository.findOne({
      where: { username: username },
      select: ["id", "username", "bio", "image"],
      relations: ["followers"],
    });
    if (!profile) throw new NotFoundError("User profile");

    if (req.method === "POST") {
      if (
        !profile.followers.some((follower) => follower.id === loggedUser.id)
      ) {
        profile.followers.push(loggedUser);
        await userRepository.save(profile);
      }
    } else if (req.method === "DELETE") {
      profile.followers = profile.followers.filter(
        (follower) => follower.id !== loggedUser.id
      );
      await userRepository.save(profile);
    }

    await appendFollowers(loggedUser, profile);

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, followToggler };
