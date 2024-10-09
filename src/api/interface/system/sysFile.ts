import type { IPageQuery } from '@/api/interface'

export namespace ISysFile {

  // 查询条件
  export interface Query extends IPageQuery {
    filename?: string
    type?: string
    size?: string
    url?: string
    ext?: string
    fromType?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    filename?: string
    type?: string
    size?: string
    url?: string
    ext?: string
    fromType?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    filename?: string
    type?: string
    size?: string
    url?: string
    ext?: string
    fromType?: string
  }

}