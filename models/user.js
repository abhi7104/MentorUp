const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema  = new mongoose.Schema({
    name: {
        type : String,
        required: false
    },
    email: {
        type : String,
        required: false
    },
    password: {
        type : String,
        required: false
    },
    date: {
        type : Date,
        default: Date.now
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
        
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashySync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports  = mongoose.model('User', UserSchema);

