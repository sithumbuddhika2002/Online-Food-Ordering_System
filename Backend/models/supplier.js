const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({

  supplierID:{
    type: String,
    require: true,
  },
  name:{
    type:String,
  },
  product:{
    type:String,
  },
  nic:{
    type:String,
    require:true,
  },
  contactNo:{
    type:String,
  }
  

});

module.exports = Supplier = mongoose.model("supplier",SupplierSchema);
