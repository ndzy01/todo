/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input } from 'antd';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMount } from 'ahooks';
import { useState } from 'react';
import Editor from '../component/Editor';
import serviceAxios from '../http';
import Preview from '../component/Preview';

const UpdateArticle = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const [article, setArticle] = useState<ITree>();

  const update = (values: any) => {
    if (state.id) {
      serviceAxios
        .patch(`/tree/${state.id}`, {
          name: values.name,
          content: values.content,
        })
        .finally(() => {
          form.resetFields();
          navigate('/article');
        });
    } else {
      serviceAxios
        .post('/tree', {
          name: values.name,
          content: values.content,
          pId: state.pId,
        })
        .finally(() => {
          form.resetFields();
          navigate('/article');
        });
    }
  };

  const getTitle = () => {
    if (searchParams.get('isView') === '1') {
      return article?.name;
    }

    if (state.id) {
      return '编辑文章';
    }

    return '新建文章';
  };

  useMount(() => {
    if (searchParams.get('id')) {
      serviceAxios.get(`/tree/${searchParams.get('id')}`).then((res) => {
        setArticle(res.data[0]);
      });
    }
  });

  return (
    <div>
      <h1 className="text-center">{getTitle()}</h1>
      {searchParams.get('isView') === '1' ? (
        <Preview md={article?.content || ''} />
      ) : (
        <Form
          initialValues={{
            name: state?.name,
            content: state?.content,
          }}
          name="update"
          onFinish={update}
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

          <Form.Item name="content" label="详情">
            <Editor />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UpdateArticle;
