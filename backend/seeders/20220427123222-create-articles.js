"use strict";

const AppDataSource = require("../db.config.js");
const User = require("../entities/User");
const Article = require("../entities/Article");

module.exports = {
  async up(queryRunner) {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const articleRepository = AppDataSource.getRepository(Article);

    const users = await userRepository.find();

    const articles = Array(55)
      .fill(null)
      .map((_, index) => ({
        slug: `lorem-ipsum-${index + 1}`,
        title: `Lorem Ipsum ${index + 1}`,
        description: `${
          index + 1
        } - Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nec ante lacinia magna ultricies cursus nec non lacus. Praesent blandit sodales semper. Mauris eget leo non erat molestie faucibus luctus sed ex. Duis sollicitudin tellus vitae aliquam cursus. Integer ultricies ultricies erat. Vivamus egestas ac augue nec mattis. Duis posuere bibendum ex vitae placerat. Duis in odio vestibulum, pellentesque odio vitae, egestas nibh.`,
        author: users[Math.floor(Math.random() * users.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    await articleRepository.save(articles);
  },

  async down(queryRunner) {
    const articleRepository = getRepository(Article);
    await articleRepository.clear();
  },
};
