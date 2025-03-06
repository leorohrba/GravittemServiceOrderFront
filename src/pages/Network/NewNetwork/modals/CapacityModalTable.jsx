import DefaultTable from '@components/DefaultTable'
import { Form, InputNumber } from 'antd'
import PropTypes from 'prop-types'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function CapacityModalTable() {
  const [tableData, setTableData] = useState([
    {
      periodo: 'Manhã',
      segunda: '10',
      terca: '10',
      quarta: '',
      quinta: '',
      sexta: '',
      sabado: '',
      domingo: '',
    },
    {
      periodo: 'Tarde',
      segunda: '',
      terca: '',
      quarta: '',
      quinta: '0',
      sexta: '20',
      sabado: '',
      domingo: '',
    },
    {
      periodo: 'Noite',
      segunda: '',
      terca: '',
      quarta: '',
      quinta: '',
      sexta: '',
      sabado: '',
      domingo: '',
    },
  ])
  const EditableContext = React.createContext()

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

  EditableRow.propTypes = {
    index: PropTypes.any,
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
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ]}
        >
          <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
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

  EditableCell.propTypes = {
    children: PropTypes.any,
    dataIndex: PropTypes.any,
    editable: PropTypes.any,
    handleSave: PropTypes.func,
    record: PropTypes.any,
    title: PropTypes.any,
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const tableColumns = [
    {
      title: '',
      key: 'periodo',
      dataIndex: 'periodo',
      render: d => <b>{d}</b>,
    },
    {
      title: 'Seg',
      key: 'segunda',
      dataIndex: 'segunda',
      editable: true,
    },
    {
      title: 'Ter',
      key: 'terca',
      dataIndex: 'terca',
      editable: true,
    },
    {
      title: 'Qua',
      key: 'quarta',
      dataIndex: 'quarta',
      editable: true,
    },
    {
      title: 'Qui',
      key: 'quinta',
      dataIndex: 'quinta',
      editable: true,
    },
    {
      title: 'Sex',
      key: 'sexta',
      dataIndex: 'sexta',
      editable: true,
    },
    {
      title: 'Sáb',
      key: 'sabado',
      dataIndex: 'sabado',
      editable: true,
    },
    {
      title: 'Dom',
      key: 'domingo',
      dataIndex: 'domingo',
      editable: true,
    },
  ]

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
    const newData = [...tableData]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    setTableData(newData)
  }

  return (
    <DefaultTable
      className="mt-2"
      dataSource={tableData}
      columns={columns}
      pagination={false}
      rowClassName={() => 'editable-row'}
      components={components}
    />
  )
}
