import SwitchCard from '@components/SwitchCard'
import SwitchCollapse from '@components/SwitchCollapse'
import React, { useState } from 'react'

export default function Test() {
  const [activedKeys, setActivedKeys] = useState([])
  const [checkedValues, setCheckedValues] = useState([])

  const data = [
    {
      key: 11,
      permission: 'Ordem de serviço',
      children: [
        { key: 1, description: 'Consultar' },
        { key: 2, description: 'Salvar' },
        { key: 3, description: 'Excluir' },
      ],
    },
    {
      key: 22,
      permission: 'Contrato',
      children: [
        { key: 4, description: 'Consultar' },
        { key: 5, description: 'Salvar' },
        { key: 6, description: 'Excluir' },
      ],
    },
  ]

  const [checked, setChecked] = useState([])

  const content = [
    {
      key: 1,
      title: 'Estoque',
      extra: 'R$ 149,90/mês',
      content: (
        <div>
          <i
            className="fa fa-check fa-lg mr-4"
            style={{ color: 'dodgerblue' }}
          />
          Teste
        </div>
      ),
    },
    {
      key: 1,
      title: 'Sugestão de compra',
      extra: 'R$ 38,00/mês',
      content: (
        <div>
          <i
            className="fa fa-check fa-lg mr-4"
            style={{ color: 'dodgerblue' }}
          />
          Teste
        </div>
      ),
    },
  ]

  return (
    <div className="container">
      <SwitchCollapse
        data={data}
        activedKeys={activedKeys}
        setActivedKeys={setActivedKeys}
        checkedValues={checkedValues}
        setCheckedValues={setCheckedValues}
      />
      <div className="mt-10">
        <SwitchCard
          checked={checked}
          setChecked={setChecked}
          content={content}
        />
      </div>
    </div>
  )
}
