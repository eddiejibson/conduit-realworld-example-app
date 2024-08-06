const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Tag",
  tableName: "tags",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
  },
  relations: {
    articles: {
      target: "Article",
      type: "many-to-many",
      joinTable: {
        name: "ArticleTags",
        joinColumn: {
          name: "tagId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "articleId",
          referencedColumnName: "id",
        },
      },
    },
  },
});
