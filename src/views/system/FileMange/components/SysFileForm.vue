<template>
  <el-dialog
    v-model="visible"
    :title="`${paramsProps.title}`"
    :destroy-on-close="true"
    width="580px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      label-width="140px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <el-form-item label="文件名" prop="filename">
        <el-input
          v-model="paramsProps.row.filename"
          placeholder="请填写文件名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="paramsProps.row.type" clearable placeholder="请选择类型">
          <el-option
            v-for="item in optionsStore.getDictOptions('file_from_type')"
            :key="item.id"
            :label="item.codeName"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文件大小" prop="size">
        <el-input
          v-model="paramsProps.row.size"
          placeholder="请填写文件大小"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="文件域名" prop="url">
        <el-input
          v-model="paramsProps.row.url"
          placeholder="请填写文件域名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="扩展名" prop="ext">
        <el-input
          v-model="paramsProps.row.ext"
          placeholder="请填写扩展名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="fromType">
        <el-select v-model="paramsProps.row.fromType" clearable placeholder="请选择来源">
          <el-option
            v-for="item in optionsStore.getDictOptions('file_from_type')"
            :key="item.id"
            :label="item.codeName"
              :value="Number(item.id)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { type ElForm, ElMessage } from 'element-plus'
import { useOptionsStore } from '@/stores/modules/options'

defineOptions({
    name: 'SysFileForm'
})

const optionsStore = useOptionsStore()

const rules = reactive({
  filename: [{ required: true, message: '请填写文件名' }],
  fromType: [{ required: true, message: '请填写文件类型' }],
  createTime: [{ required: true, message: '请填写创建时间' }],
})

const visible = ref(false)
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {},
  api: undefined,
  getTableList: undefined
})

// 接收父组件传过来的参数
const acceptParams = (params: View.DefaultParams) => {
  paramsProps.value = params
  visible.value = true
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<InstanceType<typeof ElForm>>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await paramsProps.value.api!(paramsProps.value.row)
      ElMessage.success({ message: `${paramsProps.value.title}成功！` })
      paramsProps.value.getTableList!()
      visible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({
  acceptParams
})
</script>

<style scoped lang="scss"></style>