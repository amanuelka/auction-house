const { Schema, model } = require('mongoose');

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/i;

const userSchema = new Schema({
    firstName: { type: String, required: true, minlength: 1 },
    lastName: { type: String, required: true, minlength: 1 },
    email: { type: String, required: true, unique: true, match: [EMAIL_PATTERN, 'Invalid email'] },
    hashedPassword: { type: String, required: true }
});

userSchema.index({ email: 1, }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;