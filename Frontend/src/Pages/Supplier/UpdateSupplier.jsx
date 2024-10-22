import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Navbar from '../../Components/guest_header';
import Sidebar from '../../Components/sidebar';

// Yup validation schema
const validationSchema = Yup.object().shape({
  supplierID: Yup.string().required("Supplier ID is required"),
  name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  nic: Yup.string()
    .required("NIC is required")
    .matches(/^[0-9]{9}[vVxX]|^[0-9]{12}$/, "Invalid NIC format"),
  product: Yup.string().required("Product is required"),
  contactNo: Yup.string()
    .required("Contact No is required")
    .matches(/^[0-9]{10}$/, "Invalid contact number, must be 10 digits"),
});

function UpdateSupplier() {
  const [supplier, setSupplier] = useState({
    supplierID: "",
    name: "",
    nic: "",
    product: "",
    contactNo: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3002/api/suppliers/${id}`)
      .then((res) => {
        setSupplier({
          supplierID: res.data.supplierID,
          name: res.data.name,
          nic: res.data.nic,
          product: res.data.product,
          contactNo: res.data.contactNo,
        });
      })
      .catch((err) => {
        console.log("Error from update Supplier", err);
      });
  }, [id]);

  const handleSubmit = (values) => {
    axios
      .put(`http://localhost:3002/api/suppliers/${id}`, values)
      .then((res) => {
        navigate(`/showdetails/${id}`);
      })
      .catch((err) => {
        console.log("Error in update", err);
      });
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
          <div className="container">
            <div className="row">
              <div className="col-md-8 mx-auto">
                <br />
                {/* Show Supplier List Button */}
                <button
                  onClick={() => navigate("/supplierlist")}
                  style={{
                    backgroundColor: "#ffc107",
                    color: "black",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    marginBottom: "20px"
                  }}
                >
                  Show Supplier List
                </button>
              </div>
            </div>

            <div className="col-md-8 mx-auto">
              <Formik
                initialValues={supplier}
                enableReinitialize={true}
                validationSchema={validationSchema} // Applying Yup validation schema
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form noValidate>
                    <div className="form-group">
                      <label htmlFor="supplierID">Supplier ID</label>
                      <Field
                        type="text"
                        name="supplierID"
                        className="form-control"
                        placeholder="Supplier ID"
                      />
                      <ErrorMessage
                        name="supplierID"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="nic">NIC</label>
                      <Field
                        type="text"
                        name="nic"
                        className="form-control"
                        placeholder="NIC"
                      />
                      <ErrorMessage
                        name="nic"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="product">Product</label>
                      <Field
                        type="text"
                        name="product"
                        className="form-control"
                        placeholder="Product"
                      />
                      <ErrorMessage
                        name="product"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contactNo">Contact No</label>
                      <Field
                        type="text"
                        name="contactNo"
                        className="form-control"
                        placeholder="Contact No"
                      />
                      <ErrorMessage
                        name="contactNo"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-outline-info btn-lg btn-block"
                      disabled={isSubmitting}
                    >
                      Update Supplier
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateSupplier;
