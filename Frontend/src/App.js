import React from 'react';
import Footer from './Components/customer_footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/dashboard';

import AddMenu from './Pages/Menu/add_menu';
import UpdateMenu from './Pages/Menu/update_menu';
import ViewMenu from './Pages/Menu/view_menu';
import MenuReport from './Pages/Menu/menu_report';

import HomePage from './Pages/Guest/home_page';
import OrderPage from './Pages/Guest/order_page';
import DeliveryPage from './Pages/Guest/delivery_page';
import ViewDelivery from './Pages/Delivery/view_delivery';

import AddInventory from './Pages/Inventory/add_inventory';
import ViewInventory from './Pages/Inventory/view_inventory';
import UpdateInventory from './Pages/Inventory/update_inventory';

import PaymentPage from './Pages/Guest/payment_page';
import ViewPayment from './Pages/Payment/view_payment';
import InventoryReportPage from './Pages/Inventory/inventory_report';

import UpdateDelivery from './Pages/Delivery/update_delivery';
import RegisterForm from './Pages/User/register';
import LoginForm from './Pages/User/login';
import ForgotPasswordForm from './Pages/User/forgot-password';
import ResetPasswordPage from './Pages/User/reset-password';
import UpdatePayment from './Pages/Payment/update_payment';
import MenuPage from './Pages/Guest/menu_page';
import PaymentReportPage from './Pages/Payment/payment-report';
import DeliveryReportPage from './Pages/Delivery/delivery_report';
import ViewUsers from './Pages/User/view_users';
import UserReportPage from './Pages/User/user_report';
import UpdateUser from './Pages/User/update-user';
import ProtectedRoute from './Components/ProtectedRoute';
import ManageProfile from './Pages/User/manage_profile';
import ReviewPage from './Pages/Review/AddReviewPage';
import DashboardPage from './Pages/Dashboard/MainDashboard';
import EditReviewPage from './Pages/Review/UpdateReview';
import ViewReviews from './Pages/Review/ViewReviewPage';
import ReviewReportPage from './Pages/Review/ReviewReport';
import UpdateReview from './Pages/Review/UpdateSingleReview';

import EmployeeForm from './Pages/Employee/EmployeeForm'
import EmployeeManage from './Pages/Employee/EmployeeManage'
import SalaryForm from './Pages/Employee/SalaryForm'

import SupplierList from './Pages/Supplier/SupplierList'
import InsertSupplier from './Pages/Supplier/InsertSupplier'
import ShowSupplierDetails from './Pages/Supplier/ShowSupplierDetails'
import UpdateSupplier from './Pages/Supplier/UpdateSupplier'

import PromotionList from './Pages/Promotion/PromotionList';
import ViewList from './Pages/Promotion/ViewList';
import UpdatePromotion from './Pages/Promotion/UpdatePromotion';
import InsertPromotion from './Pages/Promotion/InsertPromotion';

function App() {
  return (
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-menu" element={<AddMenu />} />
          <Route path="/update-menu/:id" element={<UpdateMenu />} />
          <Route path="/view-menu" element={<ViewMenu />} />
          <Route path="/menu-report" element={<MenuReport />} />
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/order-page" element={<OrderPage />} />
          <Route path="/payment-page" element={<PaymentPage />} />
          <Route path="/delivery-page" element={<DeliveryPage />} />
          <Route path="/view-payment" element={<ViewPayment />} />
          <Route path="/update-payment/:id" element={<UpdatePayment />} />
          <Route path="/view-delivery" element={<ViewDelivery />} />
          <Route path="/add-inventory" element={<AddInventory />} />
          <Route path="/view-inventory" element={<ViewInventory />} />
          <Route path="/inventory-report" element={<InventoryReportPage />} />
          <Route path="/update-inventory/:id" element={<UpdateInventory />} />
          <Route path="/update-delivery/:id" element={<UpdateDelivery />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />     
          <Route path="/payment-report" element={<PaymentReportPage />} />   
          <Route path="/delivery-report" element={<DeliveryReportPage />} />   
          <Route path="/view-users" element={<ViewUsers />} />             
          <Route path="/user-report" element={<UserReportPage />} />    
          <Route path="/update-user/:id" element={<UpdateUser />} />     
          <Route path="/manage-profile/:id" element={<ManageProfile />} />     
          <Route path="/review/:menuItemId" element={<ReviewPage/>} />
          <Route path="/main-dashboard" element={<DashboardPage/>} />
          <Route path="/edit-review/:menuItemId" element={<EditReviewPage />} /> 
          <Route path="/view-reviews" element={<ViewReviews />} /> 
          <Route path="/review-report" element={<ReviewReportPage />} /> 
          <Route path="/review/edit/:id" element={<UpdateReview />} /> 


          <Route path="/employeeform" element={<EmployeeForm />} /> 
          <Route path="/employeemanage" element={<EmployeeManage />} /> 
          <Route path="/salary" element={<SalaryForm />} /> 

          <Route path="/supplierlist" element={<SupplierList />} />
          <Route path='/insert' element={<InsertSupplier/>}/>
          <Route path='/showdetails/:id' element={<ShowSupplierDetails/>}/>
          <Route path='/updatedetails/:id' element={<UpdateSupplier/>} />

          <Route path="/view-list" element={<ViewList />} />
          <Route path="/insert-promotion" element={<InsertPromotion />} />
          <Route path="/updatePromotion/:id" element={<UpdatePromotion />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/menu" element={<MenuPage />} />
          </Route>

        </Routes>
        <Footer></Footer>
      </div>
  );
}

export default App;
