import { Form, Table, TimePicker } from 'antd'
import moment from 'moment'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNewCalendarContext } from '../context/NewCalendarContext'

const { RangePicker } = TimePicker

const EditableContext = React.createContext()

export default function NewCalendarHoursTable() {
  const { hoursTable, setHoursTable, canBeUpdated } = useNewCalendarContext()

  const tableColumns = [
    {
      title: 'Dia',
      dataIndex: 'diaDescricao',
      width: 150,
    },
    {
      title: 'Hora',
      dataIndex: 'hora',
      width: 200,
      editable: canBeUpdated,
      render: d =>
        d?.length === 2 && (
          <div>{`${moment(d[0]).format('HH:mm')} - ${moment(d[1]).format(
            'HH:mm',
          )}`}</div>
        ),
    },
    {
      title: 'Intervalo',
      dataIndex: 'intervalo',
      width: 200,
      editable: canBeUpdated,
      render: d =>
        d?.length === 2 && (
          <div>{`${moment(d[0]).format('HH:mm')} - ${moment(d[1]).format(
            'HH:mm',
          )}`}</div>
        ),
    },
  ]

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef()
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      })
    }

    const save = async e => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        // console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
        >
          <RangePicker format="HH:mm" ref={inputRef} onChange={save} />
        </Form.Item>
      ) : (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = tableColumns.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  const handleSave = row => {
    const newData = [...hoursTable]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    setHoursTable(newData)
  }

  return (
    <Table
      components={components}
      rowClassName={() => 'editable-row'}
      dataSource={hoursTable}
      columns={columns}
      pagination={false}
    />
  )
}
