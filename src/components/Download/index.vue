<template>
  <div>
    <button @click="handleDownload">下载文件</button>
    <progress v-if="progress" :value="progressValue" max="100">{{ progressValue }}%</progress>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

interface DownloadProps {
  url: string;
  method: 'GET' | 'POST';
  params?: Record<string, any>;
  filename: string;
}

export default defineComponent({
  name: 'DownloadComponent',
  props: {
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String as () => 'GET' | 'POST',
      required: true,
      validator: (value: 'GET' | 'POST') => ['GET', 'POST'].includes(value),
    },
    params: {
      type: Object as () => Record<string, any>,
      default: () => ({}),
    },
    filename: {
      type: String,
      required: true,
    },
  },
  setup(props: DownloadProps) {
    const progress = ref(false);
    const progressValue = ref(0);

    const handleDownload = async () => {
      try {
        progress.value = true;
        const response = await fetch(props.url, {
          method: props.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: props.method === 'POST' ? JSON.stringify(props.params) : undefined,
        });

/*        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }*/

        const contentLength = response.headers.get('Content-Length');
        let receivedLength = 0;

        const reader = response.body.getReader();
        const stream = new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                receivedLength += value.length;
                progressValue.value = (receivedLength / parseInt(contentLength as string, 10)) * 100;
                controller.enqueue(value);
                push();
              }).catch(error => {
                console.error('下载失败', error);
                controller.error(error);
              });
            }
            push();
          },
        });

        const blob = await new Response(stream, { headers: { "Content-Type": "application/octet-stream" } }).blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = props.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('下载失败', error);
      } finally {
        progress.value = false;
        progressValue.value = 0;
      }
    };

    return {
      handleDownload,
      progress,
      progressValue,
    };
  },
});
</script>
