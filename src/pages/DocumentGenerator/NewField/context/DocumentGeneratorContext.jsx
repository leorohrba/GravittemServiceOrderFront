/* eslint-disable no-unused-vars */
import constate from 'constate'
import { useState } from 'react'

function useNewField() {
  const [NewFieldModalVisible, setNewFieldModalVisible] = useState(false)
  const [data, setData] = useState([])
  const [editData, setEditData] = useState([])
  const [rowSelection, setRowSelection] = useState([])
  return {
    NewFieldModalVisible,
    setNewFieldModalVisible,
    data,
    setEditData,
    rowSelection,
  }
}

const [NewFieldProvider, useNewFieldContext] = constate(useNewField)

export { NewFieldProvider, useNewFieldContext }
