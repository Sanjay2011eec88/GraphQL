const { buildSchema } = require('graphql');

//Creating a graphql schema
//Type{ queryName : return type by adding ! at end makes it required field}

// module.exports = buildSchema(`
//     type TestData {
//         text: String!
//         views: Int!
//     }
//
//     type RootQuery {
//         hello: TestData!
//     }
//
//     schema {
//         query: RootQuery
//     }
//
// `);


//For mutation through graphql that is updating data
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
        posts: [Post!]!
    }
    
    type AuthData {
        token: String!,
        userId: String!
    }

    input UserData {
        email: String!
        name: String!
        password: String!
    }
    
    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }
    
    type RootMutation {
        createUser(userInput: UserData): User!
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);


//To query the data use a post API and add the json body
// ```
// {
// 	"query":"{ hello { text views } }"
// }
//
// where hello is our root query string and text and views are the optional data which can be queried.
// ```