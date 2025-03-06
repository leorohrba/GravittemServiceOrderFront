import SwitchCollapse from '@components/SwitchCollapse'
import React from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'antd'

const { Panel } = Collapse
function PermissionsList({
  activedKeys,
  setActivedKeys,
  checkedValues,
  setCheckedValues,
  permissions,
}) {
  return (
    <div>
      {permissions.map(p => (
        <Collapse className="mb-5">
          <Panel header={<div className="font-bold text-lg">{p.collapse}</div>}>
            <SwitchCollapse
              data={p.conteudo}
              {...{
                activedKeys,
                setActivedKeys,
                checkedValues,
                setCheckedValues,
              }}
            />
          </Panel>
        </Collapse>
      ))}
    </div>
  )
}
PermissionsList.propTypes = {
  data: PropTypes.any,
  activedKeys: PropTypes.any,
  setActivedKeys: PropTypes.any,
  checkedValues: PropTypes.any,
  setCheckedValues: PropTypes.any,
  permissions: PropTypes.any,
}
export default PermissionsList
