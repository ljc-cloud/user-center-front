import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {Button, Image} from 'antd';
import { useRef } from 'react';
import {deleteUser, searchUsers, updateUser} from "@/services/ant-design-pro/api";
import message from "antd/es/message";
import {history} from "umi";

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
    ellipsis: true,
    tip: '用户名过长自动收缩',
  },
  {
    title: '用户账户',
    dataIndex: 'userAccount',
    copyable: true
  },
  {
    title: '用户头像',
    render: (_, record) => (
      <div>
        <Image src={record.avatarUrl} width={100}/>
      </div>
    ),
    dataIndex: 'avatarUrl',
  },
  {
    title: '用户性别',
    dataIndex: 'gender',
    align: "center",
    valueType: 'select',
    valueEnum: {
      0: {
        text: '男'
      },
      1: {
        text: '女'
      }
    }
  },
  {
    title: '用户号码',
    dataIndex: 'phone',
    copyable: true
  },
  {
    title: '用户邮箱',
    dataIndex: 'email',
    copyable: true
  },
  {
    title: '星球编号',
    dataIndex: 'planetCode',
    copyable: true
  },
  {
    title: '用户状态',
    dataIndex: 'userStatus',
    valueEnum: {
      0: {
        text: '正常',
        status: 'success'
      },
      1: {
        text: '异常',
        status: 'error'
      }
    }
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    valueEnum: {
      0: {
        text: '用户'
      },
      1: {
        text: '管理员'
      }
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime'
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  /**
   * 跳转到新增用户页面
   */
  const addUser = () => {
    history.push('/admin/addUser');
  }

  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        const userList = await searchUsers(params as API.SearchParams);
        return {
          data: userList
        }
      }}
      editable={{
        type: 'multiple',
        onDelete: async (key, row) => {
          const res = await deleteUser(row.id);
          if (res) {
            message.success('删除成功');
          } else {
            message.error('出现错误');
          }
        },
        onSave: async (key,record) => {
          const res = await updateUser(record);
          if (res) {
            message.success('更新用户成功');
          } else {
            message.error('出现错误');
          }
        },
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',

      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} onClick={addUser} type="primary">
          新建
        </Button>
      ]}
    />
  );
};
