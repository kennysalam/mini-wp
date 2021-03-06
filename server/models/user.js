const mongoose = require('mongoose')
const Schema = mongoose.Schema
const hash = require('../helpers/bcrypt')

const userSchema = new Schema({
    name: {
        required: [true, 'Name is required'],
        type: String
    },
    email: {
        required: [true, 'Email is required'],
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
        validate: {
            validator(email) {
                return User.findOne({
                    email
                })
                .then(user=>{
                    if(user){
                        return false
                    }
                    else {
                        return true
                    }
                })
            },
            message: 'Email already registered'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Minimum password length 8 character']
    }
})

userSchema.pre("save", function(next){
    let hashedPass = hash(this.password)
    this.password = hashedPass
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User