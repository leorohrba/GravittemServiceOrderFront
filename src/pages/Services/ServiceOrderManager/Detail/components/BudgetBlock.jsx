import { Button } from 'antd'
import React, { useState } from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import BudgetBlockParcels from './BudgetBlockParcels'
import BudgetBlockValues from './BudgetBlockValues'

export default function BudgetBlock() {
  const { budgetData } = useNewServiceOrderContext()
  const [total, setTotal] = useState(0)
  return (
    <div>
      <BudgetBlockValues {...{ total, setTotal }} />
      <BudgetBlockParcels {...{ total }} />
      {budgetData?.status === 1 && (
        <div className="flex mt-3">
          <Button
            style={{
              color: '#57b600',
              borderColor: '#57b600',
            }}
            className="mr-2"
          >
            <i className="fa fa-thumbs-o-up fa-lg mr-3" />
            Aprovar orçamento
          </Button>
          <Button
            style={{
              color: 'red',
              borderColor: 'red',
            }}
          >
            <i className="fa fa-thumbs-o-down fa-lg mr-3" />
            Reprovar orçamento
          </Button>
        </div>
      )}
    </div>
  )
}
