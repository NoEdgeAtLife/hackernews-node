const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { getUserId } = require('./utils');
const Subscription = require('./resolvers/Subscription')
const { PubSub } = require('apollo-server')

const pubsub = new PubSub()

const Vote = require('./resolvers/Vote')
// 1
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }]
  
const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  Subscription,
  Vote,
}

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };},
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );