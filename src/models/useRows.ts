import { useEffect, useState } from 'react'

function useRows() {
  const [selectedRows, setSelectedRows] = useState([])
  const [keyTable, setKeyTable] = useState(0)

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  useEffect(() => {
    console.log('ROWS  ', selectedRows)
  }, [selectedRows])

  return { selectedRows, keyTable, setKeyTable, rowSelection }
}

export default useRows
