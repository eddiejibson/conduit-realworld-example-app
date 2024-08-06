const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Article",
  tableName: "articles",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "text",
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
    comments: {
      target: "Comment",
      type: "one-to-many",
      inverseSide: "article",
    },
    tags: {
      target: "Tag",
      type: "many-to-many",
      joinTable: {
        name: "ArticleTags",
        joinColumn: {
          name: "articleId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "tagId",
          referencedColumnName: "id",
        },
      },
    },
  },
});
