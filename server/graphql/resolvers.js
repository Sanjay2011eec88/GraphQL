const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');

module.exports = {
    // hello() {
    //     return {
    //         text:"Hello World!s",
    //         views: 12
    //     }
    // }
    

    //The first argument will contain a object contianing the arguments defined in schema
    //e.g args = { userInput:{}}
    //So we using destructring to get the object directly
    createUser: async function({userInput}, req) {
        const errors = [];
        if(!validator.isEmail(userInput.email)){
            errors.push({message: 'Email is invalid'})
        }

        if(
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, {min: 5})
        ){
            errors.push({message: 'Password too short'})
        }

        if(errors.length > 0){
            const error =  new Error('Invalid input');
            error.data = errors;
            error.code = 403;
            throw error;
        }

        const existingUser = await User.findOne({email: userInput.email});
        if(existingUser){
            const error = new Error('User exists already!');
            error.data = errors;
            error.code = 403;
            throw error;
        }
        const hashedPw = await  bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        })

        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    }
};