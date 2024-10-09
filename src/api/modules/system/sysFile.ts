import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { ISysFile } from '@/api/interface/system/sysFile'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getSysFileListApi = (params: ISysFile.Query) => {
  return http.get<IPage<ISysFile.Row>>(ADMIN_MODULE + `/sys-file`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createSysFileApi = (params: ISysFile.Form) => {
  return http.post(ADMIN_MODULE + `/sys-file`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateSysFileApi = (params: ISysFile.Form) => {
  return http.put(ADMIN_MODULE + `/sys-file`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeSysFileApi = (params: { ids: number[] }) => {
 return http.delete(ADMIN_MODULE + `/sys-file`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getSysFileDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<ISysFile.Row>(ADMIN_MODULE + `/sys-file/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importSysFileExcelApi = (params : UploadRawFile) => {
  return http.upload(ADMIN_MODULE + `/sys-file/import`, params)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportSysFileExcelApi  = (params: ISysFile.Query) => {
  return http.download(ADMIN_MODULE + `/sys-file/export`, params)
}