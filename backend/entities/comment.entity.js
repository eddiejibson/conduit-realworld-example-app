const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Comment",
  tableName: "comments",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    body: {
      type: "text",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "userId",
        referencedColumnName: "id",
      },
    },
    article: {
      target: "Article",
      type: "many-to-one",
      joinColumn: {
        name: "articleId",
        referencedColumnName: "id",
      },
    },
  },
});
