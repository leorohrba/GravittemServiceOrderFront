import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Button, DatePicker, Select, Table, Tag } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const { Option } = Select

export default function AddSchedulingModalTable() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment())
  const [selectedTableType, setSelectedTableType] = useState(1)
  const [data, setData] = useState([])

  const periodData = [
    {
      horario: '06:00 - 12:00',
      periodo: 'Manhã',
      servicos: [
        {
          tecnico: 'João da Silva',
          hora: '08:00',
          descricao: 'Reparo',
        },
        {
          tecnico: 'João da Silva',
          hora: '10:00',
          descricao: 'Instalação',
        },
      ],
    },
    {
      horario: '13:00 - 18:00',
      periodo: 'Tarde',
      servicos: [
        {
          tecnico: 'João da Silva',
          hora: '14:00',
          descricao: 'Reparo',
        },
        {
          tecnico: 'Pedro Martins',
          hora: '14:00',
          descricao: 'Reparo',
        },
      ],
    },
  ]
  const dailyData = [
    {
      horario: '08:00',
      servicos: [
        {
          tecnico: 'João da Silva',
          hora: '08:00',
          descricao: 'Reparo',
        },
      ],
    },
    {
      horario: '09:00',
      servicos: [
        {
          tecnico: 'João da Silva',
          hora: '09:00',
          descricao: 'Reparo',
        },
        {
          tecnico: 'Pedro Martins',
          hora: '09:00',
          descricao: 'Reparo',
        },
      ],
    },
  ]

  const columns = [
    {
      title: '',
      width: '15%',
      render: d =>
        selectedTableType === 1 ? (
          d.horario
        ) : (
          <div className="text-center">
            <span>{d.horario}</span>
            <br />
            <SmallTableFieldDescription
              label={d.periodo}
              fontStyle="italic"
              color="gray"
            />
          </div>
        ),
    },
  ]
  data.map((d, index) =>
    columns.push({
      title: d.servicos[index].tecnico,
      dataIndex: 'servicos',
      render: servicos =>
        servicos.map(
          s =>
            s.tecnico === d.servicos[index].tecnico && (
              <React.Fragment>
                <Tag color="#108ee9" key={s.descricao}>
                  {s.hora} - {s.descricao}
                </Tag>
                <br />
              </React.Fragment>
            ),
        ),
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            // realizar o agendamento
          },
        }
      },
    }),
  )

  useEffect(() => {
    if (selectedTableType === 2) {
      setData(periodData)
    } else {
      setData(dailyData)
    }
  }, [selectedTableType])

  return (
    <React.Fragment>
      <div className="flex my-3 justify-items-center justify-between">
        <div>
          <Button onClick={() => setIsOpen(!isOpen)}>Hoje</Button>
          <DatePicker
            style={{ visibility: 'hidden' }}
            open={isOpen}
            format="DD/MM/YYYY"
            defaultValue={selectedDate}
            onChange={e => setSelectedDate(e)}
            onSelect={() => setIsOpen(false)}
          />
        </div>
        <div className="flex items-baseline">
          <i
            className="fa fa-chevron-left fa-lg cursor-pointer"
            onClick={() =>
              setSelectedDate(moment(selectedDate).subtract(1, 'day'))
            }
          />
          <h2 className="mx-5">{selectedDate.format('dddd, MMMM DD')}</h2>
          <i
            className="fa fa-chevron-right fa-lg cursor-pointer"
            onClick={() => setSelectedDate(moment(selectedDate).add(1, 'day'))}
          />
        </div>
        <Select
          defaultValue={selectedTableType}
          onChange={e => setSelectedTableType(e)}
          style={{ width: '200px' }}
        >
          <Option value={1}>Diário</Option>
          <Option value={2}>Diário (Período)</Option>
        </Select>
      </div>
      <Table bordered dataSource={data} columns={columns} pagination={false} />
    </React.Fragment>
  )
}
