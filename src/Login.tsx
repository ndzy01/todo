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
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = (values: { mobile: string; password: string }) => {
    setLoading(true);
    serviceAxios
      .post('/users/login', { ...values })
      .then((res) => {
        if (res && res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);

          navigate('/');
          window.location.reload();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...formItemLayout} name="login" onFinish={login} style={{ maxWidth: 366 }} scrollToFirstError>
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

      <Form.Item {...buttonItemLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
