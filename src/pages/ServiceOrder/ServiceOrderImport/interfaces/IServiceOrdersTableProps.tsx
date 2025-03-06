import { IDataExport } from './IDataExport'
import { IRecord } from './IRecord'

export interface IServiceOrdersTableProps {
  data?: IRecord[]
  rowSelection?: any
  keyTable?: number
  userPermissions?: any[]
  dataExport?: IDataExport[]
  screenType?: string
}
