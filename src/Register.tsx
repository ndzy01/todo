/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input } from 'antd';
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
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    serviceAxios
      .post('/users/register', { ...values })
      .then((res) => {
        if (res.status === 0) {
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...formItemLayout} name="register" onFinish={onFinish} style={{ maxWidth: 366 }} scrollToFirstError>
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

      <Form.Item {...buttonItemLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
