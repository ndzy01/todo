/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMount } from 'ahooks';
import { Button, Input, Form, Select, DatePicker } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import serviceAxios from './http';
import Editor from './component/Editor';
import { disabledDate } from './utils';

const EditTodo = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<any[]>([]);

  const goHome = () => {
    navigate('/');
  };

  const edit = (values: any) => {
    setLoading(true);
    serviceAxios
      .patch(`/todos/${state.id}`, {
        name: values.name,
        detail: values.detail,
        link: values.link,
        deadline: dayjs(values.deadline).format('YYYY-MM-DD'),
        tagId: values.tagId,
      })
      .finally(() => {
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
    <Form
      name="edit"
      initialValues={{
        name: state.name,
        deadline: dayjs(state.deadline),
        detail: state.detail,
        link: state.link,
        tagId: state.tagId,
      }}
      onFinish={edit}
      scrollToFirstError
      form={form}
    >
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

      <Form.Item
        name="deadline"
        label="终止时间"
        rules={[
          {
            required: true,
            message: '终止时间不能为空',
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={disabledDate} />
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
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditTodo;
