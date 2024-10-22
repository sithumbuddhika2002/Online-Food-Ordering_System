import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PromotionList from './PromotionList';
import Navbar from '../../Components/guest_header';
import Sidebar from '../../Components/sidebar';

const ViewList = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3002/api/promotions')
      .then((res) => {
        setPromotions(res.data);
        console.log(res.data);
      })
      .catch(() => {
        console.log('Error while getting data');
      });
  }, []);

  const promotionList = promotions.length === 0 ? (
    'No promotions found!'
  ) : (
    <PromotionList promotions={promotions} />
  );

  return (
    <>
    <Navbar />
    <div style={{display: 'flex'}}>
    <Sidebar />
    <div className='show-promotion-list'>
      <div className='container'>
        
        <div className='list  d-flex justify-content-center'>{promotionList}</div>
        <Link
          className='btn-inser'
          to={`/insert-promotion`}
        >
         Add Promotion +
        </Link>
      </div>
    </div>
    </div>
    </>
  );
};

export default ViewList;
