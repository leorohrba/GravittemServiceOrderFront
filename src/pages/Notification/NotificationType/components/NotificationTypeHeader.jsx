import Breadcrumb from '@components/Breadcrumb'
import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function NotificationTypeHeader({
  tags,
  setTags,
  startSearch,
  setNewNotificationModal,
}) {
  const searchOptions = [
    {
      value: 'Tipo',
      label: 'Tipo',
      type: 'search',
      options: [],
    },
  ]

  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumb />
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          startSearch={startSearch}
        />
      </div>

      <Row type="flex" className="mt-8">
        <Button type="primary" onClick={() => setNewNotificationModal(true)}>
          Novo tipo
        </Button>
      </Row>
    </div>
  )
}

NotificationTypeHeader.propTypes = {
  setTags: PropTypes.any,
  startSearch: PropTypes.func,
  setNewNotificationModal: PropTypes.func,
  tags: PropTypes.array,
}
