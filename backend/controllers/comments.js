const {
  NotFoundError,
  UnauthorizedError,
  FieldRequiredError,
  ForbiddenError,
} = require("../helper/customErrors");
const { appendFollowers } = require("../helper/helpers");
const Article = require("../entities/article.entity.js");
const Comment = require("../entities/comment.entity.js");
const User = require("../entities/user.entity.js");
const AppDataSource = require("../db.config.js");

//? All Comments for Article
const allComments = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    const { slug } = req.params;

    const articleRepository = AppDataSource.getRepository(Article);
    const commentRepository = AppDataSource.getRepository(Comment);

    const article = await articleRepository.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comments = await commentRepository.find({
      where: { article: article },
      relations: ["author"],
    });

    for (const comment of comments) {
      await appendFollowers(loggedUser, comment);
    }

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

//* Create Comment for Article
const createComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { body } = req.body.comment;
    if (!body) throw new FieldRequiredError("Comment body");

    const { slug } = req.params;
    const articleRepository = AppDataSource.getRepository(Article);
    const commentRepository = AppDataSource.getRepository(Comment);

    const article = await articleRepository.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comment = commentRepository.create({
      body: body,
      article: article,
      author: loggedUser,
    });

    await commentRepository.save(comment);

    delete loggedUser.token;
    comment.author = loggedUser;
    await appendFollowers(loggedUser, loggedUser);

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

//* Delete Comment for Article
const deleteComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug, commentId } = req.params;
    const commentRepository = AppDataSource.getRepository(Comment);

    const comment = await commentRepository.findOne({
      where: { id: commentId },
      relations: ["author"],
    });
    if (!comment) throw new NotFoundError("Comment");

    if (loggedUser.id !== comment.author.id) {
      throw new ForbiddenError("comment");
    }

    await commentRepository.remove(comment);

    res.json({ message: { body: ["Comment deleted successfully"] } });
  } catch (error) {
    next(error);
  }
};

module.exports = { allComments, createComment, deleteComment };
