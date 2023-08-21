/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { FileAddOutlined, FormOutlined, FileExcelOutlined, EyeOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Tree, Space, Popconfirm, Spin, Button } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import serviceAxios from '../http';
import { ReduxContext } from '../redux';

const { DirectoryTree } = Tree;
const Article = () => {
  const { state, dispatch } = useContext(ReduxContext);
  const navigate = useNavigate();
  const [s, setS] = useState([]);

  const arrayToTree = (list: ITree[], root: string): any => {
    return list
      .filter((item) => item.pId === root)
      .map((item) => {
        const isLeaf = arrayToTree(list, item.id).length === 0;

        return {
          ...item,
          title: (
            <div className="between inline-flex w-88">
              {item.name}
              <Space>
                <EyeOutlined onClick={() => goView(item)} />
                <FileAddOutlined onClick={() => goCreate(item)} />
                <FormOutlined onClick={() => goEdit(item)} />
                {isLeaf && (
                  <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => del(item)}>
                    <FileExcelOutlined />
                  </Popconfirm>
                )}
              </Space>
            </div>
          ),
          key: item.id,
          isLeaf,
          children: arrayToTree(list, item.id),
        };
      });
  };

  const goView = (item: ITree) => {
    navigate({
      pathname: '/updateArticle',
      search: `?${createSearchParams({ isView: '1', id: item.id })}`,
    });
  };

  const getAll = () => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });

    serviceAxios
      .get('/tree')
      .then((res) => {
        setS(arrayToTree(res.data, '0'));
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  const goEdit = (item: ITree) => {
    navigate('/updateArticle', { state: { ...item } });
  };

  const goCreate = (item: ITree) => {
    navigate('/updateArticle', { state: { pId: item.id } });
  };

  const del = (item: ITree) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });

    serviceAxios
      .delete(`/tree/${item.id}`)
      .then(() => {
        getAll();
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  const onSelect: DirectoryTreeProps['onSelect'] = (_keys, info) => {
    dispatch({ type: 'UPDATE', payload: { article: info.node as unknown as ITree } });
  };

  const updateUser = () => {
    serviceAxios.get('/users').then((res) => {
      dispatch({ type: 'UPDATE', payload: { user: res.data } });
    });
  };

  useMount(() => {
    getAll();
    updateUser;
  });

  return (
    <div>
      {s.length > 0 &&
        (state.loading ? (
          <Spin />
        ) : (
          <>
            <Button onClick={() => navigate('/updateArticle', { state: { pId: '0' } })}>创建根目录</Button>
            <DirectoryTree
              selectedKeys={state.article?.id ? [state.article?.id] : []}
              onSelect={onSelect}
              showLine
              defaultExpandAll
              treeData={s}
            />
          </>
        ))}
    </div>
  );
};

export default Article;
