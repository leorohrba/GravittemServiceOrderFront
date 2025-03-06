import Breadcrumb from '@components/Breadcrumb'
import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import Link from 'umi/link'

export default function NetworkHeader({ tags, setTags, startSearch }) {
  const searchOptions = [
    {
      value: 'Rede',
      label: 'Rede',
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
        <Link to="/Network/NewNetwork">
          <Button type="primary">Nova rede</Button>
        </Link>
        <Button className="iconButton ml-auto">
          <i className="fa fa-ellipsis-v" aria-hidden="true" />
        </Button>
      </Row>
    </div>
  )
}

NetworkHeader.propTypes = {
  setTags: PropTypes.any,
  startSearch: PropTypes.func,
  tags: PropTypes.array,
}
