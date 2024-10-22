import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/guest_header';
import Sidebar from '../../Components/sidebar';
import './UpdatePromotion.css';
import { styled } from '@mui/system'; // Updated import for Material UI
import Typography from '@mui/material/Typography'; // Importing Typography from Material UI

function UpdatePromotion() {
  const [promotion, setPromotions] = useState({
    promotionID: '',
    code: '',
    foodItem: '',
    codeCategory: '',
    discount: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3002/api/promotions/${id}`)
      .then((res) => {
        setPromotions({
          promotionID: res.data.promotionID,
          code: res.data.code,
          foodItem: res.data.foodItem,
          codeCategory: res.data.codeCategory,
          discount: res.data.discount,
        });
      })
      .catch((err) => {
        console.log('Error from update promotions');
      });
  }, [id]);

  const onChange = (e) => {
    setPromotions({ ...promotion, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      promotionID: promotion.promotionID,
      code: promotion.code,
      foodItem: promotion.foodItem,
      codeCategory: promotion.codeCategory,
      discount: promotion.discount,
    };

    axios
      .put(`http://localhost:3002/api/promotions/${id}`, data)
      .then((res) => {
        navigate(`/view-list`);
      })
      .catch((err) => {
        console.log('Error in Update');
      });
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', width: '100%' }}>
        <Sidebar />
        <div className='admin-container update-promotion' style={{ flex: 1, marginTop: '40px' }}>
          <Typography variant="h4" style={{ fontFamily: 'cursive', color: 'purple', textAlign: 'center', marginBottom: '20px' }}>
            Update Promotion Code
          </Typography>
          <form onSubmit={onSubmit} className="promo-code-form" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="form-group">
              <label htmlFor="promotionID">Promotion Code ID</label>
              <input
                type="text"
                id="promotionID"
                name="promotionID"
                placeholder="Enter Code ID"
                value={promotion.promotionID}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Promotion Code</label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="Enter Promotion Code"
                value={promotion.code}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="foodItem">Applied Food Item</label>
              <select
                id="foodItem"
                name="foodItem"
                value={promotion.foodItem}
                onChange={onChange}
              >
                <option value="" disabled>
                  Select a Food Item
                </option>
                <option value="Golden Cheese Fries">Golden Cheese Fries</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="codeCategory">Promotion Code Category</label>
              <select
                id="codeCategory"
                name="codeCategory"
                value={promotion.codeCategory}
                onChange={onChange}
              >
                <option value="" disabled>
                  Select a Category
                </option>
                <option value="Time Based">Time Based</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="discount">Discount</label>
              <input
                type="text"
                id="discount"
                name="discount"
                placeholder="Enter Discount"
                value={promotion.discount}
                onChange={onChange}
              />
            </div>

            <button className="btn-submit" type="submit" style={{ padding: '12px', backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px' }}>
              Update Promotion Code
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdatePromotion;
