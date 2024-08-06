const express = require("express");
const router = express.Router();
const { appendTagList } = require("../helper/helpers");
const Tag = require("../entities/tag.entity");
const AppDataSource = require("../db.config.js");

// All Tags
router.get("/", async (req, res, next) => {
  try {
    const tagRepository = AppDataSource.getRepository(Tag);
    const tagList = await tagRepository.find();

    const tags = appendTagList(tagList);

    res.json({ tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
