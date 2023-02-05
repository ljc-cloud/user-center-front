import {
  ProForm,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import styles from "@/pages/user/Register/index.less";
import {register} from "@/services/ant-design-pro/api";
import {history} from "@@/core/history";

export default () => {
  return (
    <>
      <ProFormRadio.Group
        style={{
          margin: 16,
        }}
        // radioType="button"
      />
      <div
        style={{
          margin: 24,
        }}
      >
        <ProForm
          submitter={
            {
              searchConfig: {
                submitText: "添加"
              },
              // 配置按钮的属性
              resetButtonProps: {
                style: {
                  // 隐藏重置按钮
                  display: 'none',
                },
              },
            }
          }
          onFinish={async (values: any) => {
            // 校验
            const {userPassword, checkPassword} = values;
            if (userPassword !== checkPassword) {
              message.error('两次输入的密码不一致');
              return;
            }
            try {
              // 注册
              const res = await register(values);
              if (res) {
                const defaultLoginSuccessMessage = '注册成功！';
                message.success(defaultLoginSuccessMessage);
                /** 此方法会跳转到 redirect 参数所在的位置 */
                if (!history) return;
                // const {query} = history.location;
                history.push({
                  pathname: '/admin/user-manage'
                });
                return;
              }
            } catch (error: any) {
              console.log(error)
            }
          }}
        >
          <ProFormText
            width={ "md" }
            name="userAccount"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon}/>,
            }}
            placeholder={'账户'}
            rules={[
              {
                required: true,
                message: '账户是必填项！',
              },
              {
                min: 4,
                type: "string",
                message: '账户长度不能小于4！',
              }
            ]}
          />
          <ProFormText.Password
            width={ "md" }
            name="userPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon}/>,
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '密码是必填项！',
              },
              {
                min: 8,
                type: "string",
                message: '密码长度不能小于8！',
              }
            ]}
          />
          <ProFormText.Password
            width={ "md" }
            name="checkPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon}/>,
            }}
            placeholder={'确认密码'}
            rules={[
              {
                required: true,
                message: '确认密码是必填项！',
              },
              {
                min: 8,
                type: "string",
                message: '密码长度不能小于8！',
              }
            ]}
          />
          <ProFormText
            width={ "md" }
            name="planetCode"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon}/>,
            }}
            placeholder={'星球编号'}
            rules={[
              {
                required: true,
                message: '星球编号是必填项！',
              },
            ]}
          />
        </ProForm>
      </div>
    </>
  );
};
