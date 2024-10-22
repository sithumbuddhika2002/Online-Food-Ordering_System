import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import Navbar from '../../Components/guest_header'; 
import Sidebar from '../../Components/sidebar'; 

const ShowSupplierDetailsPage = () => {
  const [supplier, setSupplier] = useState(null);
  const { id } = useParams();
  const componentRef = useRef();

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/suppliers/${id}`);
        setSupplier(response.data);
      } catch (error) {
        console.error("Error fetching supplier details:", error);
      }
    };

    fetchSupplierDetails();
  }, [id]);

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, backgroundColor: '#f0f2f5', padding: '20px', minHeight: '100vh' }}>
          <div style={{ maxWidth: '800px', margin: 'auto', padding: '30px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
            
            {/* Back to Main Button */}
            <Link 
              to="/" 
              className="btn btn-danger" 
              style={{ 
                marginBottom: '20px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                padding: '12px 24px', 
                fontSize: '16px', 
                borderRadius: '5px', 
                textDecoration: 'none',
                color: '#fff',
                backgroundColor: '#dc3545', // Bootstrap danger color
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            >
              <i className="bi bi-arrow-left-circle" style={{ marginRight: '5px' }}></i> 
              Back to Main
            </Link>

            <h1 style={{ color: '#343a40', textAlign: 'center', marginBottom: '10px' }}>Supplier Details</h1>
            <p style={{ textAlign: 'center', color: '#6c757d' }}>This is the full detail of the supplier</p>
            <hr style={{ borderColor: '#dee2e6' }} />

            <div ref={componentRef}>
              <table className="table" style={{ marginTop: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
                <thead style={{ backgroundColor: '#007bff', color: '#fff' }}>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Field</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>ID</td>
                    <td>{supplier ? supplier.supplierID : 'Loading...'}</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Name</td>
                    <td>{supplier ? supplier.name : 'Loading...'}</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>Product</td>
                    <td>{supplier ? supplier.product : 'Loading...'}</td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>NIC</td>
                    <td>{supplier ? supplier.nic : 'Loading...'}</td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>Contact No</td>
                    <td>{supplier ? supplier.contactNo : 'Loading...'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px' }}>
              <Link
                to={`/updatedetails/${supplier ? supplier._id : ''}`}
                className="btn btn-info btn-lg btn-block d-flex justify-content-center"
                style={{ 
                  pointerEvents: supplier ? 'auto' : 'none', 
                  opacity: supplier ? 1 : 0.5, 
                  padding: '12px', 
                  fontSize: '16px', 
                  borderRadius: '5px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#fff',
                  backgroundColor: '#17a2b8', // Bootstrap info color
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#138496'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#17a2b8'}
              >
                <i className="bi bi-pencil-square" style={{ marginRight: '5px' }}></i> 
                Edit Supplier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowSupplierDetailsPage;
