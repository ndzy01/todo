import type { TabsProps } from 'antd';
import { Button, Form, Input, Tabs } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceAxios from './http';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = (values: any) => {
    setLoading(true);
    serviceAxios.post('/users/register', { ...values }).finally(() => {
      setLoading(false);
    });
  };

  const login = (values: any) => {
    setLoading(true);
    serviceAxios
      .post('/users/login', { ...values })
      .then((res) => {
        if (res && res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          navigate('/');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '登录',
      children: (
        <Form {...formItemLayout} name="login" onFinish={login} style={{ maxWidth: 366 }} scrollToFirstError>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="mobile" label="手机号" rules={[{ required: true, message: '请输入你的手机号!' }]}>
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button loading={loading} type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '注册',
      children: (
        <Form {...formItemLayout} name="register" onFinish={onFinish} style={{ maxWidth: 366 }} scrollToFirstError>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请再次输入密码!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码不匹配!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入你的昵称!', whitespace: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="mobile" label="手机号" rules={[{ required: true, message: '请输入你的手机号!' }]}>
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button loading={loading} type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default Login;
