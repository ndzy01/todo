import { useMount } from 'ahooks';
import { Button, Input, Form, Select, DatePicker } from 'antd';
import { useContext } from 'react';
import Editor from '../component/Editor';
import { disabledDate } from '../utils';
import { ReduxContext } from '../redux';
import { useTodo } from '../hooks';

const CreateTodo = () => {
  const { initTags, initUser, createTodo } = useTodo();
  const { state } = useContext(ReduxContext);
  useMount(() => {
    initUser();
    initTags();
  });
  return (
    <Form name="create" onFinish={(values) => createTodo(values)} scrollToFirstError>
      <Form.Item>
        <h1 className="text-center">创建待办</h1>
      </Form.Item>
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
        <DatePicker className="w-100" format="YYYY-MM-DD" disabledDate={disabledDate} />
      </Form.Item>
      <Form.Item
        name="detail"
        label="详情"
        rules={[
          {
            required: true,
            message: '详情不能为空',
          },
        ]}
      >
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
        <Select options={state.tags.map((item) => ({ label: `${item.name}-(${item.userName})`, value: item.id }))} />
      </Form.Item>
      <Form.Item>
        <Button loading={state.loading} type="primary" htmlType="submit">
          创建
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CreateTodo;
