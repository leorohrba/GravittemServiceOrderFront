/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import { Button } from 'antd'
import { formatMessage } from 'umi-plugin-react/locale'

const definicoes = [
  { code: 'CANC', color: 'gray', icon: 'fa-ban' },
  { code: 'CANCR', color: 'gray', icon: 'fa-undo' },
  { code: 'FALT', color: 'red' },
  { code: 'RESE', color: 'blue', icon: 'fa-calendar-plus-o' },
  { code: 'UTLZ', color: 'green', icon: 'fa-thumbs-o-up' },
  { code: 'REQU', color: '#809aeb', icon: 'fa-handshake-o' },
  { code: 'PDIA', color: 'orange', icon: 'fa-thumbs-o-up' },
  { code: 'SUGE', color: '#ff7b00', icon: 'fa-lightbulb-o' },
  { code: 'AGUA', color: '#de9595' },
  { code: 'NUTZ', color: '#c0c0c0' },
  { code: 'EST', color: 'orange', icon: 'fa-undo' },
  { code: 'DEL', color: 'red', icon: 'fa-trash' },
  { code: 'PED', color: '#faca00', icon: 'fa-money' },
]

export const getColor = (code) => definicoes.find(x => x.code === code)?.color || 'black'

export const getIcon = (code) => definicoes.find(x => x.code === code)?.icon || 'fa-file-o'

export const getCompleteIcon = (code, mr) => {
  const icon = getIcon(code)
  const color = getColor(code)
  return <i
    style={{ color }}
    className={`fa ${icon} fa-lg mr-${mr || 3}`}
  />  
}

export function Status({ code, description }) {
  return (
    <span style={{ color: getColor(code) }}>
      <i 
        style={{ color: getColor(code) }}
        className="fa fa-circle mr-2"
      />
      {description}      
    </span>
  )
}

export function ButtonAction({ action, code, selectedRows, confirmAction }) {
  return ( 
    <Button
      onClick={() => confirmAction(action, selectedRows)}
      style={{ borderColor: getColor(code)}}
      className="mr-2"
    >
      {getCompleteIcon(code, 2)}
      <span style={{ color: getColor(code)}}>
        {formatMessage({
          id: `serviceOrder.serviceOrderParts.${action}`,
        })}{' '}
        ({selectedRows.length})
      </span>
    </Button>
  ) 
}