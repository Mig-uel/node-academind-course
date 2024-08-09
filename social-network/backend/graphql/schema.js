const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    post: [Post!]
    createdAt: String!
    updatedAt: String!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  } 

  type AuthData {
    token: String!
    userId: String!
  }

  type PostsData {
    posts: [Post!]
    totalPosts: Int!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    posts(page: Int): PostsData
    post(id: ID!): Post!
  }

  type RootMutation {
    signup(userInput: UserInputData): User!
    addPost(post: PostInputData): Post!
    updatePost(id: ID!, post: PostInputData): Post!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
    }
  `)
