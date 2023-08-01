const mongoose = require('mongoose');
const {Schema}= mongoose

const RefreshTokenSchema = new Schema({
    token : {type: String, required: true},
    userid: {type:mongoose.SchemaTypes.ObjectId, ref: 'User'}
},
   { timestamps: true }
);

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema,"tokens");