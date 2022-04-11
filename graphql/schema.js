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
	test: Boolean
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
	): Boolean

	loginUser(
		email: String!
		password: String!
	): String

}
`;

module.exports = makeExecutableSchema({
	typeDefs,
	resolvers
});