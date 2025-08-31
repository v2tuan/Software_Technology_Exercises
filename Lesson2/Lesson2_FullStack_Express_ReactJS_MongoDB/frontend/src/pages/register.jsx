// src/pages/register.jsx
import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { name, email, password } = values;
    setLoading(true);
    try {
      const res = await createUserApi(name, email, password);
      const ok = res?._id || res?.EC === 0;

      if (ok) {
        notification.success({ message: 'CREATE USER', description: 'Success' });
        navigate('/login');
      } else {
        notification.error({
          message: 'CREATE USER',
          description: res?.EM || 'Error'
        });
      }
    } catch (e) {
      notification.error({
        message: 'CREATE USER',
        description: e?.message || 'Error'
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
          <legend>Đăng Ký Tài Khoản</legend>

          <Form
            form={form}
            name="register"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            disabled={loading}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Your name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Email is not valid!' }
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'At least 6 characters' }
              ]}
            >
              <Input.Password placeholder="******" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Create account
            </Button>

            <Divider />

            <Link to="/login">
              <ArrowLeftOutlined /> Đăng nhập
            </Link>
          </Form>
        </fieldset>
      </Col>
    </Row>
  );
};

export default RegisterPage;