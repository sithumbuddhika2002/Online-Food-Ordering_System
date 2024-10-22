const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db_connection = require("./database/index");
var cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const menuRoutes = require("./routes/menu"); 
const deliveryRoutes = require("./routes/delivery");   
const paymentRoutes = require("./routes/payment");   
const inventoryRoutes = require("./routes/inventory");  
const userRoutes = require("./routes/user");
const reviewRoutes = require("./routes/review");
const admin = require('./routes/admin.js');
const salary = require('./routes/salary.js');
const routes = require("./routes/suppliers");
const promotions = require("./routes/promotions");


const app = express();

app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db_connection();

app.use("/menu", menuRoutes);   
app.use("/delivery", deliveryRoutes);  
app.use("/payment", paymentRoutes); 
app.use("/inventory", inventoryRoutes);
app.use("/user", userRoutes); 
app.use("/review", reviewRoutes); 
app.use('/admin', admin);
app.use('/salary', salary);
app.use("/api/suppliers", routes);
app.use("/api/promotions",promotions);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
