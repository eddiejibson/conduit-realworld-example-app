const { UnauthorizedError, NotFoundError } = require("../helper/customErrors");
const {
  appendFollowers,
  appendFavorites,
  appendTagList,
} = require("../helper/helpers");
const Article = require("../entities/article.entity");
const AppDataSource = require("../db.config");

//*  Favorite/Unfavorite Article
const favoriteToggler = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug } = req.params;

    const article = await AppDataSource.getRepository(Article).findOne({
      where: { slug: slug },
      relations: ["tagList", "author"],
    });
    if (!article) throw new NotFoundError("Article");

    if (req.method === "POST") {
      await AppDataSource.createQueryBuilder()
        .relation(Article, "favoritedBy")
        .of(article)
        .add(loggedUser);
    } else if (req.method === "DELETE") {
      await AppDataSource.createQueryBuilder()
        .relation(Article, "favoritedBy")
        .of(article)
        .remove(loggedUser);
    }

    const updatedArticle = await AppDataSource.getRepository(Article).findOne({
      where: { slug: slug },
      relations: ["tagList", "author", "favoritedBy"],
    });

    appendTagList(updatedArticle.tagList, updatedArticle);
    await appendFollowers(loggedUser, updatedArticle);
    await appendFavorites(loggedUser, updatedArticle);

    res.json({ article: updatedArticle });
  } catch (error) {
    next(error);
  }
};

module.exports = { favoriteToggler };
