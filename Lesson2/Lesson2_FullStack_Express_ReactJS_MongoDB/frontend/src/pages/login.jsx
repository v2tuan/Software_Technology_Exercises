// src/pages/login.jsx
import React, { useContext, useState } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { loginApi } from '../util/api.js';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AuthContext from '../components/context/auth.context';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await loginApi(email, password); // { EC, access_token, user }
      if (res && res.EC === 0) {
        localStorage.setItem('access_token', res.access_token);
        notification.success({ message: 'LOGIN USER', description: 'Success' });

        setAuth({
          isAuthenticated: true,
          user: {
            email: res?.user?.email ?? '',
            name:  res?.user?.name  ?? ''
          }
        });

        navigate('/');
      } else {
        notification.error({
          message: 'LOGIN USER',
          description: res?.EM ?? 'error'
        });
      }
    } catch (e) {
      notification.error({
        message: 'LOGIN USER',
        description: e?.message || 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: '30px' }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: '15px',
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        >
          <legend>Đăng Nhập</legend>

          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            disabled={loading}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Email is not valid!' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>

            <Divider />

            <Link to="/"><ArrowLeftOutlined /> Trang chủ</Link>
            <span style={{ margin: '0 8px' }}>|</span>
            <Link to="/register">Đăng ký</Link>
          </Form>
        </fieldset>
      </Col>
    </Row>
  );
};

export default LoginPage;