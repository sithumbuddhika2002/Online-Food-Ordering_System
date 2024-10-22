import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaTachometerAlt, FaTruckLoading, FaReceipt, FaUserTie, FaRegListAlt, FaSignOutAlt, FaUtensilSpoon, FaFileInvoiceDollar, FaClipboardList, FaTags
} from 'react-icons/fa';
import Logo from '../Images/logo.png';

const SidebarContainer = styled.div`
  width: 220px;
  height: 250vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: #ecf0f1;
  background-image: url('https://wallpapers.com/images/hd/black-color-background-kvv6asd39zluqt0o.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const LogoImage = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 10px;
`;

const LogoTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ecf0f1;
`;

const Menu = styled.div`
  flex-grow: 1;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 18px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  
  &:hover {
    background-color: #34495e;
    color: #fff;
  }
`;

const Icon = styled.div`
  margin-right: 15px;
  font-size: 20px;
`;

const SubMenu = styled.div`
  padding-left: 30px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const SubMenuItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  
  &:hover {
    background-color: #2c3e50;
    color: #fff;
  }
`;

const Sidebar = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage src={Logo} alt="Logo" />
      </LogoContainer>
      <Menu>
        <MenuItem onClick={() => toggleSection('menu')}>
          <Icon><FaUtensilSpoon /></Icon>
          Menu
        </MenuItem>
        {openSection === 'menu' && (
          <SubMenu isOpen={openSection === 'menu'}>
            <Link to="/view-menu" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>View Menu</SubMenuItem>
            </Link>
            <Link to="/add-menu" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Add Menu</SubMenuItem>
            </Link>
            <Link to="/menu-report" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Menu Report</SubMenuItem>
            </Link>
          </SubMenu>
        )}

        <MenuItem onClick={() => toggleSection('delivery')}>
          <Icon><FaTruckLoading /></Icon>
          Delivery
        </MenuItem>
        {openSection === 'delivery' && (
          <SubMenu isOpen={openSection === 'delivery'}>
            <Link to="/view-delivery" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>View Delivery</SubMenuItem>
            </Link>
            <Link to="/delivery-report" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Delivery Report</SubMenuItem>
            </Link>
          </SubMenu>
        )}

        <MenuItem onClick={() => toggleSection('payment')}>
          <Icon><FaFileInvoiceDollar /></Icon>
          Payment
        </MenuItem>
        {openSection === 'payment' && (
          <SubMenu isOpen={openSection === 'payment'}>
            <Link to="/view-payment" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>View Payment</SubMenuItem>
            </Link>
            <Link to="/payment-report" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Payment Report</SubMenuItem>
            </Link>
          </SubMenu>
        )}

        <MenuItem onClick={() => toggleSection('inventory')}>
          <Icon><FaClipboardList /></Icon>
          Inventory
        </MenuItem>
        {openSection === 'inventory' && (
          <SubMenu isOpen={openSection === 'inventory'}>
            <Link to="/view-inventory" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>View Inventory</SubMenuItem>
            </Link>
            <Link to="/add-inventory" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Add Inventory</SubMenuItem>
            </Link>
            <Link to="/inventory-report" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Inventory Report</SubMenuItem>
            </Link>
          </SubMenu>
        )}

        <MenuItem onClick={() => toggleSection('users')}>
          <Icon><FaUserTie /></Icon>
          Users
        </MenuItem>
        {openSection === 'users' && (
          <SubMenu isOpen={openSection === 'users'}>
            <Link to="/view-users" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>View Users</SubMenuItem>
            </Link>
            <Link to="/user-report" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>User Report</SubMenuItem>
            </Link>
          </SubMenu>
        )}

        <MenuItem onClick={() => toggleSection('reviews')}>
          <Icon><FaReceipt /></Icon>
          Reviews
        </MenuItem>
        {openSection === 'reviews' && (
          <SubMenu isOpen={openSection === 'reviews'}>
            <Link to="/view-reviews" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>View Reviews</SubMenuItem>
            </Link>
            <Link to="/review-report" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Review Report</SubMenuItem>
            </Link>
          </SubMenu>
        )}

        <MenuItem onClick={() => toggleSection('employee')}>
          <Icon><FaUserTie /></Icon>
          Manage Employee
        </MenuItem>
        {openSection === 'employee' && (
          <SubMenu isOpen={openSection === 'employee'}>
            <Link to="/employeemanage" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Employee List</SubMenuItem>
            </Link>
            <Link to="/employeeform" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Add Employee</SubMenuItem>
            </Link>
            <Link to="/salary" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Add Salary</SubMenuItem>
            </Link>
          </SubMenu>
        )}

        <MenuItem onClick={() => toggleSection('supplier')}>
          <Icon><FaClipboardList /></Icon>
          Supplier
        </MenuItem>
        {openSection === 'supplier' && (
          <SubMenu isOpen={openSection === 'supplier'}>
            <Link to="/supplierlist" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Supplier List</SubMenuItem>
            </Link>
            <Link to="/insert" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Insert Supplier</SubMenuItem>
            </Link>
          </SubMenu>
        )}

        <MenuItem onClick={() => toggleSection('promo')}>
          <Icon><FaTags /></Icon>
          Promotion
        </MenuItem>
        {openSection === 'promo' && (
          <SubMenu isOpen={openSection === 'promo'}>
            <Link to="/view-list" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>View List</SubMenuItem>
            </Link>
            <Link to="/insert-promotion" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SubMenuItem>Insert Promotion</SubMenuItem>
            </Link>
          </SubMenu>
        )}
      </Menu>
      <Link to="/home-page" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem>
          <Icon><FaSignOutAlt /></Icon>
          Sign Out
        </MenuItem>
      </Link>
    </SidebarContainer>
  );
};

export default Sidebar;
