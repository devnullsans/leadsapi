const { makeExecutableSchema } = require("@graphql-tools/schema");
const resolvers = require('./resolver');

const typeDefs = `

scalar Upload

type User {
	id: ID!
	name: String
	email: String!
	createdAt: String!
}

type Query {

	user(id: ID!): User

	users: [User!]!

	test(
		filter: String!
		document: String!
	): Boolean
}

type Mutation {

	signupUser(
		name: String!
		email: String!
		password: String!
	): User

	verifyUser(
		id: ID!
		otp: String!
	): String

}
`;

module.exports = makeExecutableSchema({
	typeDefs,
	resolvers
});