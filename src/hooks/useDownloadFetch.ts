import {ElNotification} from "element-plus";
import StreamSaver from 'streamsaver';
import { useUserStore } from '@/stores/modules/user'
import {ADMIN_MODULE} from "@/api/helper/prefix";

export const useDownloadFetch = async (
  api: string,
  tempName: string,
  params = {},
  isNotify = true,
  fileType = '.xlsx'
) => {
  if (isNotify) {
    ElNotification({
      title: '温馨提示',
      message: '如果数据庞大会导致下载缓慢哦，请您耐心等待！',
      type: 'info',
      duration: 3000
    });
  }

  try {
    // 将对象转为 URL 查询字符串
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${ADMIN_MODULE}${api}?${queryString}` : api; // 拼接成完整的 URL
    const userStore = useUserStore()
    // 使用 Fetch API 发送 GET 请求获取流数据
    const response = await fetch(url, {
        method: 'GET', // 使用 GET 方法
        headers: {
          'Authorization': 'Bearer ' + userStore.token, // 添加 Bearer Token
        },
      },
    );

    const contentLength = parseInt(response.headers.get('Content-Length') || '0');
    console.log('contentLength ==', contentLength)
    // 使用 StreamSaver 创建一个文件流
    const fileStream = StreamSaver.createWriteStream(`${tempName}${fileType}`, {size: contentLength});
    console.log('管道传输........')
    // 将响应的 ReadableStream 管道传输到文件流
    if (response.body) {
      console.log(' pipeTo Start ...')
      response.body.pipeTo(fileStream)
        .catch(err => console.error('流传输失败:', err));
      console.log('pipeTo End ...')
    }
  } catch (error) {
    console.log(error);
  }
};
