import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import Logo from '../../Images/logo.png';

const SidebarContainer = styled.div`
  width: 220px;
  height: 150vh;
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

const InventorySidebar = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage src={Logo} alt="Logo" />
      </LogoContainer>
      
      <MenuItem>
        <Icon><FaListAlt /></Icon>
        Inventory
      </MenuItem>
      
      <SubMenu>
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

      <Link to="/home-page" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem>
          <Icon><FaSignOutAlt /></Icon>
          Sign Out
        </MenuItem>
      </Link>
    </SidebarContainer>
  );
};

export default InventorySidebar;
