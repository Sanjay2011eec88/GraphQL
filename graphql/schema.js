const { buildSchema } = require('graphql');

//Creating a graphql schema
//Type{ queryName : return type by adding ! at end makes it required field}

module.exports = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }

    type RootQuery {
        hello: TestData!
    }

    schema {
        query: RootQuery
    }

`);


//To query the data use a post API and add the json body
```
{
	"query":"{ hello { text views } }"
}

where hello is our root query string and text and views are the optional data which can be queried.
```