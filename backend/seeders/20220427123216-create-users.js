const AppDataSource = require("../db.config.js");
const User = require("../entities/User");

module.exports = {
  async up() {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    const users = Array(5)
      .fill(null)
      .map((_, index) => ({
        username: `exampleUser${index + 1}`,
        email: `example${index + 1}@mail.com`,
        password: `examplePwd${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    await userRepository.save(users);
  },

  async down() {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    await userRepository.clear();
  },
};
