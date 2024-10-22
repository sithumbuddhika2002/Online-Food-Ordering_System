const express = require("express");

const router = express.Router();

const Suppliers = require("../models/supplier");
const supplier = require("../models/supplier");

//test
router.get("/test",(req,res)=> res.send("Supplier routes is working"));

router.post("/",(req,res)=>{
  Suppliers.create(req.body)
  .then(()=>res.json({msg:"Supplier added succesfully"}))
  .catch(()=>res.status(400).json({msg:"Suppplier adding faild"}));

})

router.get("/",(req,res)=>{
  Suppliers.find()
  .then((suppliers)=>res.json(suppliers))
  .catch(()=>res.status(400).json({ msg: "No suppliers found" }));
});

router.get("/:id",(req,res)=>{
  Suppliers
    .findById(req.params.id)
    .then((suppliers) => res.json(suppliers))
    .catch(() => res.status(400).json({ msg:"cannot find this supplier"}));
});

router.put("/:id", (req,res)=>{
  Suppliers.findByIdAndUpdate(req.params.id,req.body).then(()=>
    res
      .json({ msg: "update successfully" }))
      .catch(() => res.status(400).json({msg: "update faild"}));
  
});

router.delete("/:id", (req, res) => {
  Suppliers.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ msg: "Deleted successfully" });
    })
    .catch(() => {
      res.status(400).json({ msg: "Cannot be deleted" });
    });
});

module.exports = router;