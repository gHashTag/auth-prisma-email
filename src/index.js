const { GraphQLServer } = require('graphql-yoga')
const { importSchema } = require('graphql-import')
const { Prisma } = require('prisma-binding')
const { authQueries, authMutations, prismaAuthConfig } = require('@volst/prisma-auth')
const Email = require('email-templates')

const resolvers = {
  Query: {
    ...authQueries
  },
  Mutation: {
    ...authMutations
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',             // points to Prisma database schema
      endpoint: 'https://eu1.prisma.sh/dimka-vasilyev-133e06/hello-world/dev',   // Prisma service endpoint (see `~/.prisma/config.yml`)
      secret: 'mysecret123',                                // `secret` taken from `prisma.yml`
      debug: true                                           // log all requests to the Prisma API to console
    }),
    prismaAuth: prismaAuthConfig({
      // Required, used for signing JWT tokens
      secret: 'wheredidthesodago',
      // Optional, for sending emails with email-templates (https://www.npmjs.com/package/email-templates)
      mailer: new Email(),
      // Optional, the URL to your frontend which is used in emails
      mailAppUrl: 'http://example.com',
    })
  }),
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
