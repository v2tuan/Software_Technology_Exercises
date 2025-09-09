// src/components/layout/header.jsx
import React, { useContext, useMemo } from 'react';
import { Menu } from 'antd';
import {
  HomeOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProductOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/auth.context';

const Header = () => {
  const { auth, logout, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.removeItem('access_token');
    // ưu tiên dùng hàm logout trong context; nếu chưa có thì fallback setAuth
    if (typeof logout === 'function') {
      logout();
    } else if (typeof setAuth === 'function') {
      setAuth({ isAuthenticated: false, user: { email: '', name: '' } });
    }
    navigate('/');
  };

  const items = useMemo(() => {
    const arr = [
      {
        label: <Link to="/">Home Page</Link>,
        key: 'home',
        icon: <HomeOutlined />
      }
    ];

    if (auth?.isAuthenticated) {
      arr.push({
        label: <Link to="/user">Users</Link>,
        key: 'user',
        icon: <UsergroupAddOutlined />
      });
    }

    arr.push({
        label: <Link to="/products">Product</Link>,
        key: 'products',
        icon: <ProductOutlined />
      });

    arr.push({
      label: `Welcome ${auth?.user?.email ?? ''}`,
      key: 'profile',
      icon: <SettingOutlined />,
      children: auth?.isAuthenticated
        ? [
            {
              label: <span onClick={onLogout}>Đăng xuất</span>,
              key: 'logout',
              icon: <LogoutOutlined />
            }
          ]
        : [
            {
              label: <Link to="/login">Đăng nhập</Link>,
              key: 'login',
              icon: <LoginOutlined />
            }
          ]
    });

    return arr;
  }, [auth]);

  // chọn menu theo URL hiện tại
  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/user')) return 'user';
    if (location.pathname.startsWith('/login')) return 'login';
    return 'home';
  }, [location.pathname]);

  return <Menu mode="horizontal" items={items} selectedKeys={[selectedKey]} />;
};

export default Header;