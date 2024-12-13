const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Employee', 'Admin'], default: 'Employee' },
});

module.exports = mongoose.model('User', userSchema);
