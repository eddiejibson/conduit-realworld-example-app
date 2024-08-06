const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    email: {
      type: "varchar",
    },
    username: {
      type: "varchar",
    },
    bio: {
      type: "text",
    },
    image: {
      type: "text",
    },
    password: {
      type: "varchar",
    },
  },
  relations: {
    articles: {
      target: "Article",
      type: "one-to-many",
      inverseSide: "user",
    },
    comments: {
      target: "Comment",
      type: "one-to-many",
      inverseSide: "user",
    },
    favorites: {
      target: "Article",
      type: "many-to-many",
      joinTable: {
        name: "Favorites",
        joinColumn: {
          name: "userId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "articleId",
          referencedColumnName: "id",
        },
      },
    },
    followers: {
      target: "User",
      type: "many-to-many",
      joinTable: {
        name: "Followers",
        joinColumn: {
          name: "userId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "followerId",
          referencedColumnName: "id",
        },
      },
    },
    following: {
      target: "User",
      type: "many-to-many",
      joinTable: {
        name: "Followers",
        joinColumn: {
          name: "followerId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "userId",
          referencedColumnName: "id",
        },
      },
    },
  },
});
