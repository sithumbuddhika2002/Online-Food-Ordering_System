import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import axios from "axios";
import { Link } from 'react-router-dom';


const SupplierCard = ({supplier, onSupplierDelete}) => {

  const onDeleteClick = (id)=>{
    axios.delete(`http://localhost:3000/api/suppliers/${id}`).then(()=>{
      window.location.reload();
      
    })
    .catch((err)=>{
      console.log("Delete error",err);
    })

  }

  return (

        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="https://img.freepik.com/free-photo/3d-rendering-cartoon-like-man-delivering-gift_23-2150797658.jpg?ga=GA1.1.2087876742.1718750221&semt=ais_hybrid"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {supplier.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {supplier.supplierID}
                <br/>
                {supplier.product}
                <br/>
                {supplier.nic}
                <br/>
                {supplier.contactNo}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="madium"  style={{backgroundColor:'red', color:"white"}} onClick={()=>onDeleteClick(supplier._id)}>
              Delete
            </Button>

            <Link to={`/showdetails/${supplier._id}`}><Button style={{backgroundColor:'orange', color:"white"}}>Details</Button></Link>
          </CardActions>
        </Card>
  )
}

export default SupplierCard;
