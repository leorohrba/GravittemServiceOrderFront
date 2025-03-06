import React, { useState } from 'react'
import { Select, Tooltip } from 'antd'
import Link from 'umi/link'
import { SearchOutlined } from '@ant-design/icons'

export default function Pessoa() {
  const { Option } = Select
  const [searchValue, setSeachValue] = useState('')
  const [personId, setPersonId] = useState()
  const people = [
    {
      id: 'ohuhrtoig',
      nome: 'Ricardin 2000',
      documento: '555.333.444-22',
      endereco: 'rua dos cedros, 34, \n Lugar Nenhum - Cidade Grande, SC',
      justificativa: 'devendo',
      status: 1,
      repetidos: 0,
    },
    {
      id: 'aaaaaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
    {
      id: 'aaaaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 0,
    },
    {
      id: 'aaaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 0,
    },
    {
      id: 'aaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 0,
    },
    {
      id: 'aaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 1,
    },
    {
      id: 'aaakkaaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 10,
    },
    {
      id: 'aaaagaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
    {
      id: 'aaaaakaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
    {
      id: 'aaacaaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
    {
      id: 'aaaaiaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
    {
      id: 'aaaaxaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
    {
      id: 'aaaaaQaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
    {
      id: 'aaaaaAaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
    {
      id: 'aaaaCCaaa',
      nome: 'Batatinha 3000',
      documento: '222.555.333-45',
      justificativa: '',
      endereco: 'rua dos homens, 3999, Lugar Nenhum - Cidade Grande, SC',
      status: 2,
      repetidos: 3,
    },
  ]
  const [data, setData] = useState(people)

  function searchPeople(value) {
    setSeachValue(value)
    setData(
      people.filter(
        p =>
          p.nome.toLowerCase().includes(value.toLowerCase()) ||
          p.documento.includes(value),
      ),
    )
  }
  const highlight = (text, highlight) => {
    const regex = new RegExp(`(${highlight})`, 'ig')
    const parts = text.split(regex)
    return parts.map((part, i) => {
      if (part.toLowerCase() === highlight.toLowerCase()) {
        return <b key={i}>{part}</b>
      }
      return part
    })
  }
  return (
    <div className="m-10" style={{ width: '300px' }}>
      <div className="flex">
        <div className="font-bold mr-auto">Pessoa</div>
        {personId && <Link>editar</Link>}
      </div>
      <Select
        showSearch
        showArrow={false}
        dropdownMatchSelectWidth
        onChange={value => setPersonId(value)}
        filterOption={false}
        suffixIcon={<SearchOutlined />}
        style={{ width: '300px' }}
        onSearch={searchPeople}
        dropdownRender={menu => (
          <div>
            {menu}
            <div className="mt-3 mx-2">
              {`${data.length === 0 ? 'Nenhum' : data.length} ${
                data.length > 1
                  ? 'resultados encontrados'
                  : 'resultado encontrado'
              } ${searchValue.length > 0 ? 'com o termo ' : ''}`}
              <b>{searchValue}</b>. Clique para <a>cadastrar</a> outro ou{' '}
              <a>refinar a busca</a>.
            </div>
          </div>
        )}
      >
        {data.map(p => (
          <Option key={p.id}>
            <div className="flex">
              <div className="mr-3" style={{ width: '150px' }}>
                <div>{highlight(p.nome, searchValue)}</div>
                <div>{highlight(p.documento, searchValue)}</div>
                <p
                  style={{
                    width: '150px',
                    maxWidth: '150px',
                    wordBreak: 'break-all',
                  }}
                >
                  {p.endereco}
                </p>
              </div>
              {p.status === 1 ? (
                <Tooltip
                  placement="top"
                  className="ml-auto"
                  title={`${`Cadastro bloqueado. Motivo: ${p.justificativa}`}`}
                >
                  <i
                    style={{ color: 'red' }}
                    className={`fa fa-${
                      p.status === 1 ? 'lock' : ''
                    } mt-2 fa-lg`}
                  />
                </Tooltip>
              ) : (
                p.repetidos > 0 && (
                  <Tooltip
                    placement="top"
                    className="ml-auto"
                    title={`${p.repetidos} registros encontrados com este CPF. 
        Clique aqui para ver detalhes.`}
                  >
                    <div
                      className="mt-1 rounded-full h-6 w-6 flex items-center font-bold justify-center"
                      style={{ backgroundColor: 'orange', color: 'white' }}
                    >
                      {p.repetidos}
                    </div>
                  </Tooltip>
                )
              )}
            </div>
          </Option>
        ))}
      </Select>
    </div>
  )
}
