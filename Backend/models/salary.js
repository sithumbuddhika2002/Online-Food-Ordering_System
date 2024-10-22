const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salary = new Schema({
    uid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    hourlySalary: {
        type: String
    },
    hour: {
        type: String,
        required: true
    },
    otHours: {
        type: String
    },
    fixedSalary: {
        type: Number
    },
    fullSalary: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const salarySchema = mongoose.model('salary', salary);
module.exports = salarySchema;
