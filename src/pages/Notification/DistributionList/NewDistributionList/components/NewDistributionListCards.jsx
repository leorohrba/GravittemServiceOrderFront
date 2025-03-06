import { Button } from 'antd'
import React from 'react'
import { useNewDistributionListDataContext } from '../context/NewDistributionList'
import NewDistributionListLeftCard from './NewDistributionListLeftCard'
import NewDistributionListRightCard from './NewDistributionListRightCard'

export default function NewDistributionListCards() {
  const {
    addToList,
    removeFromList,
    leftSelected,
    rightSelected,
  } = useNewDistributionListDataContext()

  return (
    <div className="flex">
      <NewDistributionListLeftCard />
      <div className="mx-3 self-center">
        <Button
          type="primary"
          className="block mb-2"
          onClick={addToList}
          disabled={leftSelected.length === 0}
        >
          <i className="fa fa-chevron-right" />
        </Button>
        <Button
          type="primary"
          onClick={removeFromList}
          disabled={rightSelected.length === 0}
        >
          <i className="fa fa-chevron-left" />
        </Button>
      </div>
      <NewDistributionListRightCard />
    </div>
  )
}
