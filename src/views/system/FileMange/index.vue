<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="文件记录表"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'sys.file.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增文件表')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'sys.file.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          v-auth="'sys.file.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑文件表', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'sys.file.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template> -->
    </ProTable>
    <SysFileForm ref="sysFileRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CirclePlus,
  Delete,
  EditPen,
  Upload,
  Download,
} from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import {
  createSysFileApi,
  removeSysFileApi,
  updateSysFileApi,
  getSysFileListApi,
  getSysFileDetailApi,
  importSysFileExcelApi,
  exportSysFileExcelApi,
} from '@/api/modules/system/sysFile';
import { useHandleData } from '@/hooks/useHandleData';
import SysFileForm from '@/views/system/FileMange/components/SysFileForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { ISysFile } from '@/api/interface/system/sysFile';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useOptionsStore } from '@/stores/modules/options'
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'SysFileView'
})
const proTableRef = ref<ProTableInstance>();
const optionsStore = useOptionsStore()

// 表格配置项
const columns: ColumnProps<ISysFile.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'filename', label: '文件名' },
  { prop: 'type', label: '类型' },
  { prop: 'size', label: '文件大小' },
  { prop: 'url', label: '文件域名' },
  { prop: 'ext', label: '扩展名' },
  { prop: 'fromType', label: '来源' ,tag: true,
    enum: optionsStore.getDictOptions('file_from_type'),
    fieldNames: {
      label: 'codeName',
      value: 'id',
      tagType: 'callbackShowStyle'
    } },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'filename', label: '文件名', el: 'input' },
  { prop: 'fromType', label: '来源', el: 'select',    
  fieldNames: {
      label: 'codeName',
      value: 'id',
      tagType: 'callbackShowStyle'
  }},
  { prop: 'type', label: '类型', el: 'input' },
  { prop: 'size', label: '文件大小', el: 'input' },
  { prop: 'url', label: '文件域名', el: 'input' },
  { prop: 'ext', label: '扩展名', el: 'input' },
]
// 获取table列表
const getTableList = (params: ISysFile.Query) => {
  let newParams = formatParams(params);
  return getSysFileListApi(newParams);
};
const formatParams = (params: ISysFile.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const sysFileRef = ref<InstanceType<typeof SysFileForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getSysFileDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createSysFileApi : updateSysFileApi,
    getTableList: proTableRef.value?.getTableList
  }
  sysFileRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: ISysFile.Row) => {
  await useHandleData(
    removeSysFileApi,
    { ids: [params.id] },
    `删除【${params.id}】文件表`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: string[]) => {
  await useHandleData(removeSysFileApi, { ids }, '删除所选文件表')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '文件表',
    templateName: '文件表',
    tempApi: downloadTemplate,
    importApi: importSysFileExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as ISysFile.Query);
  useDownload(exportSysFileExcelApi, "文件表", newParams);
};
</script>