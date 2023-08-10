/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMount } from 'ahooks';
import { Button, Input, Form, Select, DatePicker } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceAxios from './http';
import Editor from './component/Editor';
import { disabledDate } from './utils';

const CreateTodo = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<any[]>([]);

  const goHome = () => {
    navigate('/');
  };

  const create = (values: any) => {
    setLoading(true);
    serviceAxios.post('/todos', { ...values }).finally(() => {
      setLoading(false);
      form.resetFields();
      goHome();
    });
  };

  useMount(() => {
    serviceAxios('/tags').then((res) => {
      setTags(res.data || []);
    });
  });

  return (
    <Form name="create" onFinish={create} scrollToFirstError form={form}>
      <Form.Item
        name="name"
        label="名称"
        rules={[
          {
            required: true,
            message: '名称不能为空',
          },
        ]}
      >
        <Input.TextArea rows={1} />
      </Form.Item>

      <Form.Item name="deadline" label="终止时间">
        <DatePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
      </Form.Item>

      <Form.Item name="detail" label="详情">
        <Editor />
      </Form.Item>

      <Form.Item name="link" label="链接">
        <Input.TextArea rows={1} />
      </Form.Item>

      <Form.Item
        name="tagId"
        label="标签"
        rules={[
          {
            required: true,
            message: '请选择一个标签',
          },
        ]}
      >
        <Select options={tags.map((item) => ({ label: item.name, value: item.id }))} />
      </Form.Item>

      <Form.Item>
        <Button loading={loading} type="primary" htmlType="submit">
          创建
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateTodo;
