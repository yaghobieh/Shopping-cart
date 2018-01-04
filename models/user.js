let mongoose = require('mongoose');
let Schema   = mongoose.Schema;
let bcrypt   = require('bcryptjs');

let UserSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

UserSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

