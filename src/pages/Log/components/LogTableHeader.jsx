import { Button } from 'antd'
import React from 'react'
import { useLogContext } from '../context/LogContext'
import moment from 'moment'
import ReactExport from 'react-data-export'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function LogTableHeader() {
  const { dataExport, data } = useLogContext()
  return (
    <div>
      <div className="flex justify-end">
        <ExcelFile
          filename={`Logs_${moment().format('DD_MM_YYYY_HH_mm')}`}
          element={
            <Button
              size="default"
              disabled={data.length === 0}
              style={{
                marginLeft: 'auto',
              }}
              className="ml-2 iconButton"
            >
              <i className="fa fa-download fa-lg mr-3" />
              Exportar
            </Button>
          }
        >
          <ExcelSheet dataSet={dataExport} name="Logs" />
        </ExcelFile>
      </div>
    </div>
  )
}
