const adminSchema = require('../models/admin');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();


router.route('/register').post(async (req, res, next) => {    
    try {
        const existingUser = await adminSchema.findOne({ email: req.body.email });
        if (existingUser) {
            return res.json({
                message: 'Email is Already Used'
            })
        }
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        let admin = new adminSchema({
            uid: req.body.uid,
            nic: req.body.nic,
            status: req.body.status,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            birthday: req.body.birthday,
            fixedSalary: req.body.fixedSalary,
            hourlySalary: req.body.hourlySalary,
            otHours: req.body.otHours,
            type: req.body.type,
            password: hashedPass,
        })
        console.log("hello")
        await admin.save();
        res.json({
            message: 'Admin Member Added'
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.route('/login').post(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        
        const existingUser = await adminSchema.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }
        
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        console.log("hello");
        
        return res.status(200).json({ message: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.route("/update").put(async (req, res) => {
    const updatedAdmin = req.body;

    const update = await adminSchema.findOneAndUpdate({ uid: updatedAdmin.uid }, updatedAdmin).then(() => {
            res.status(200).send({ status: "Updated" });
    }).catch((err) => {
            console.log(err);
            res.status(500).send({ error: err.message });
    });
});

router.route('/getAll').get(async (req, res, next) => {
    try {
        const admins = await adminSchema.find();
        return res.status(200).json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.route("/delete/:uid").delete(async (req, res) => {
    let uid = req.params.uid;

    adminSchema.findOneAndDelete({ uid: uid })
        .then(() => {
            res.status(200).send({ status: "Deleted" });

        }).catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error with Deleting Data", error: err.message });
        });
});




module.exports = router;