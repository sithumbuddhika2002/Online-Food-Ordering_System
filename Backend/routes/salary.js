const router = require('express').Router();
const Salary = require('../models/salary');
const Admin = require('../models/admin');

router.post('/add', async (req, res) => {
    try {
        const { uid, name, hourlySalary, hour, fullSalary: initialFullSalary } = req.body; // form submit values
        let role;
        let fixedSalary = 0;
        let fullSalary = initialFullSalary || 0;

        const adminF = await Admin.findOne({ uid: uid });

        if (adminF) {
            fixedSalary = adminF.fixedSalary;
            role = adminF.type;
            fullSalary += fixedSalary;
        }

        if (!role) {
            role = "Hourly Workers";
        }

        const newSalary = new Salary({ uid, name, role, fixedSalary, hourlySalary, hour, fullSalary });

        await newSalary.save();

        res.json('Salary added successfully');
    } catch (err) {
        console.error(err);
        res.status(400).json('Error: ' + err);
    }
});


router.get('/all', (req, res) => {
    Salary.find()
        .then(salaries => res.json(salaries))           //read
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
