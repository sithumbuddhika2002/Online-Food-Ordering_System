const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema({
    uid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    fixedSalary: {
        type: Number
    },
    hourlySalary: {
        type: Number
    },
    otHours: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const adminSchema = mongoose.model('admin', admin);
module.exports = adminSchema;