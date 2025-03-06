import constate from 'constate'
import { useState } from 'react'

function useNewDistributionList() {
  const columns = [
    {
      title: 'Usuário',
      key: 'nome',
      dataIndex: 'nome',
    },
  ]

  const [leftTableData, setLeftTableData] = useState([
    { id: 1, nome: 'flavio' },
    { id: 2, nome: 'maicon' },
    { id: 3, nome: 'juan' },
  ])
  const [rightTableData, setRightTableData] = useState([])

  const [rightSelected, setRightSelected] = useState([])
  const [leftSelected, setLeftSelected] = useState([])

  const rightSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setRightSelected(selectedRow)
    },
  }
  const leftSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setLeftSelected(selectedRow)
    },
  }

  const addToList = () => {
    setRightTableData([...rightTableData, ...leftSelected])
    let newData = leftTableData
    leftSelected.map(
      element => (newData = newData.filter(d => d.id !== element.id)),
    )
    setLeftTableData(newData)
    setLeftSelected([])
  }

  const removeFromList = () => {
    setLeftTableData([...leftTableData, ...rightSelected])

    let newData = rightTableData
    rightSelected.map(
      element => (newData = newData.filter(d => d.id !== element.id)),
    )
    setRightTableData(newData)
    setRightSelected([])
  }

  return {
    columns,
    leftTableData,
    leftSelection,
    addToList,
    removeFromList,
    rightTableData,
    rightSelection,
    leftSelected,
    rightSelected,
  }
}

const [
  NewDistributionListDataProvider,
  useNewDistributionListDataContext,
] = constate(useNewDistributionList)

export { NewDistributionListDataProvider, useNewDistributionListDataContext }
