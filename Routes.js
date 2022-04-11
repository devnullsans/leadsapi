const { graphqlUploadExpress } = require("graphql-upload");
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const router = require('express').Router();

router.get('/', graphqlHTTP({
	schema,
	graphiql: { headerEditorEnabled: true }
}));

router.post('/', graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }), graphqlHTTP({ schema }));

module.exports = router;