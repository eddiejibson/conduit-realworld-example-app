const {
  AlreadyTakenError,
  FieldRequiredError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} = require("../helper/customErrors");
const {
  appendFollowers,
  appendFavorites,
  appendTagList,
  slugify,
} = require("../helper/helpers");
const User = require("../entities/user.entity");
const Article = require("../entities/article.entity");
const Tag = require("../entities/tag.entity");

const AppDataSource = require("../db.config");

//? All Articles - by Author/by Tag/Favorited by user
const allArticles = async (req, res, next) => {
  try {
    const { loggedUser } = req;

    const { author, tag, favorited, limit = 3, offset = 0 } = req.query;
    const searchOptions = {
      relations: ["tagList", "author"],
      where: {},
      take: parseInt(limit),
      skip: offset * limit,
      order: { createdAt: "DESC" },
    };

    if (tag) {
      searchOptions.where.tagList = { name: tag };
    }
    if (author) {
      searchOptions.where.author = { username: author };
    }

    let articles = { rows: [], count: 0 };
    if (favorited) {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { username: favorited },
      });

      articles.rows = await user.favorites(searchOptions);
      articles.count = await user.countFavorites();
    } else {
      articles = await AppDataSource.getRepository(Article).findAndCount(
        searchOptions
      );
    }

    for (let article of articles.rows) {
      appendTagList(article.tagList, article);
      await appendFollowers(loggedUser, article);
      await appendFavorites(loggedUser, article);
    }

    res.json({ articles: articles.rows, articlesCount: articles.count });
  } catch (error) {
    next(error);
  }
};

//* Create Article
const createArticle = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { title, description, body, tagList } = req.body.article;
    if (!title) throw new FieldRequiredError("A title");
    if (!description) throw new FieldRequiredError("A description");
    if (!body) throw new FieldRequiredError("An article body");

    const slug = slugify(title);
    const slugInDB = await AppDataSource.getRepository(Article).findOne({
      where: { slug: slug },
    });
    if (slugInDB) throw new AlreadyTakenError("Title");

    const article = AppDataSource.getRepository(Article).create({
      slug: slug,
      title: title,
      description: description,
      body: body,
      author: loggedUser,
    });

    await AppDataSource.getRepository(Article).save(article);

    for (const tag of tagList) {
      const tagInDB = await AppDataSource.getRepository(Tag).findOne({
        where: { name: tag.trim() },
      });

      if (tagInDB) {
        article.tagList.push(tagInDB);
      } else if (tag.length > 2) {
        const newTag = AppDataSource.getRepository(Tag).create({
          name: tag.trim(),
        });
        await AppDataSource.getRepository(Tag).save(newTag);
        article.tagList.push(newTag);
      }
    }

    await AppDataSource.getRepository(Article).save(article);

    article.tagList = tagList;
    await appendFollowers(loggedUser, article);
    await appendFavorites(loggedUser, article);

    res.status(201).json({ article });
  } catch (error) {
    next(error);
  }
};

//* Feed
const articlesFeed = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { limit = 3, offset = 0 } = req.query;
    const authors = await loggedUser.following;

    const articles = await AppDataSource.getRepository(Article).findAndCount({
      relations: ["tagList", "author"],
      where: { author: { id: In(authors.map((author) => author.id)) } },
      take: parseInt(limit),
      skip: offset * limit,
      order: { createdAt: "DESC" },
    });

    for (const article of articles.rows) {
      appendTagList(article.tagList, article);
      await appendFollowers(loggedUser, article);
      await appendFavorites(loggedUser, article);
    }

    res.json({ articles: articles.rows, articlesCount: articles.count });
  } catch (error) {
    next(error);
  }
};

// Single Article by slug
const singleArticle = async (req, res, next) => {
  try {
    const { loggedUser } = req;

    const { slug } = req.params;
    const article = await AppDataSource.getRepository(Article).findOne({
      where: { slug: slug },
      relations: ["tagList", "author"],
    });
    if (!article) throw new NotFoundError("Article");

    appendTagList(article.tagList, article);
    await appendFollowers(loggedUser, article);
    await appendFavorites(loggedUser, article);

    res.json({ article });
  } catch (error) {
    next(error);
  }
};

//* Update Article
const updateArticle = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug } = req.params;
    const article = await AppDataSource.getRepository(Article).findOne({
      where: { slug: slug },
      relations: ["tagList", "author"],
    });
    if (!article) throw new NotFoundError("Article");

    if (loggedUser.id !== article.author.id) {
      throw new ForbiddenError("article");
    }

    const { title, description, body } = req.body.article;
    if (title) {
      article.slug = slugify(title);
      article.title = title;
    }
    if (description) article.description = description;
    if (body) article.body = body;
    await AppDataSource.getRepository(Article).save(article);

    appendTagList(article.tagList, article);
    await appendFollowers(loggedUser, article);
    await appendFavorites(loggedUser, article);

    res.json({ article });
  } catch (error) {
    next(error);
  }
};

//* Delete Article
const deleteArticle = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug } = req.params;
    const article = await AppDataSource.getRepository(Article).findOne({
      where: { slug: slug },
      relations: ["tagList", "author"],
    });
    if (!article) throw new NotFoundError("Article");

    if (loggedUser.id !== article.author.id) {
      throw new ForbiddenError("article");
    }

    await AppDataSource.getRepository(Article).remove(article);

    res.json({ message: { body: ["Article deleted successfully"] } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allArticles,
  createArticle,
  singleArticle,
  updateArticle,
  deleteArticle,
  articlesFeed,
};
