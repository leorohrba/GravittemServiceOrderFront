/**
 * breadcrumb: Redes
 * type: Menu
 */
import React, { useState } from 'react'
import NetworkHeader from './components/NetworkHeader'
import NetworkTable from './components/NetworkTable'

export default function Network() {
  const [tags, setTags] = useState([])
  const data = [{ id: 1, descricao: 'Franquias', status: 1 }]

  return (
    <div className="container">
      <NetworkHeader {...{ tags, setTags }} />
      <NetworkTable data={data} />
    </div>
  )
}
