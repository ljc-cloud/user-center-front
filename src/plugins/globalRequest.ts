import {extend} from 'umi-request';
import {history} from "@@/core/history";
import {stringify} from "querystring";
import {message} from "antd";

const request = extend({
  credentials: 'include',
  // 根据不同的环境，访问不同的域名
  prefix: process.env.NODE_ENV === 'production'? 'http://192.168.37.150:8080' : undefined
});

request.interceptors.request.use((url, options): any => {
  console.log(`do request url=${url}`);

  return {
    url,
    options: {
      ...options,
      headers: {
      },
    },
  };
});

request.interceptors.response.use(async (response, options): Promise<any> => {
  const res = await response.clone().json();
  if(res.code === 0) {
    return res.data;
  }
  if(res.code === 4011) {
    message.error('请先登录');
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: location.pathname
      }),
    });
  } else {
    message.error(res.description);
  }
  return res.data;
});

export default request;
