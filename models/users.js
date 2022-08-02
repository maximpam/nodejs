const {Schema, model} = require('mongoose');

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    }
});

module.exports = model('User', schema);