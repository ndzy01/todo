import { useMount } from 'ahooks';
import { Button, Input, Form, Select, DatePicker } from 'antd';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import serviceAxios from '../http';
import Editor from '../component/Editor';
import { disabledDate } from '../utils';
import { ReduxContext } from '../redux';

const EditTodo = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();
  const { state: todoState, dispatch } = useContext(ReduxContext);

  const goHome = () => {
    navigate('/');
  };

  const edit = (values: ITodoRecord) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });

    serviceAxios
      .patch(`/todos/${state.id}`, {
        name: values.name,
        detail: values.detail,
        link: values.link,
        deadline: dayjs(values.deadline).format('YYYY-MM-DD'),
        tagId: values.tagId,
      })
      .finally(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });

        form.resetFields();
        goHome();
      });
  };

  useMount(() => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });

    serviceAxios('/tags')
      .then((res) => {
        dispatch({ type: 'UPDATE', payload: { tags: res.data } });
      })
      .finally(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });

    serviceAxios.get('/users').then((res) => {
      dispatch({ type: 'UPDATE', payload: { user: res.data } });
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
      <Form.Item>
        <h1 className="text-center">编辑待办</h1>
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
        <Select
          options={todoState.tags.map((item) => ({ label: `${item.name}-(${item.userName})`, value: item.id }))}
        />
      </Form.Item>

      <Form.Item>
        <Button loading={todoState.loading} type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditTodo;
