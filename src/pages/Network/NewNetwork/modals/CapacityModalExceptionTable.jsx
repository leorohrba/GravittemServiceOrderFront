import DefaultTable from '@components/DefaultTable'
import { Button, DatePicker, Form, InputNumber } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function CapacityModalExceptionTable() {
  const [tableData, setTableData] = useState([])
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

    const inputNode =
      dataIndex === 'periodo' ? (
        <DatePicker format="DD/MM/YYYY" ref={inputRef} onChange={save} />
      ) : (
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
      )

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
          {inputNode}
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
    dataIndex: PropTypes.string,
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
      title: 'Data',
      key: 'periodo',
      dataIndex: 'periodo',
      editable: true,
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Manhã',
      key: 'manha',
      dataIndex: 'manha',
      editable: true,
    },
    {
      title: 'Tarde',
      key: 'tarde',
      dataIndex: 'tarde',
      editable: true,
    },
    {
      title: 'Noite',
      key: 'noite',
      dataIndex: 'noite',
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

  const handleAdd = () => {
    const newData = {
      key: tableData.length + 1,
      periodo: moment(),
      manha: '0',
      tarde: '0',
      noite: '0',
    }
    setTableData([...tableData, newData])
  }

  const handleSave = row => {
    const newData = [...tableData]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    setTableData(newData)
  }

  return (
    <React.Fragment>
      <Button type="primary" className="mt-6" onClick={handleAdd}>
        Adicionar exceções
      </Button>
      <DefaultTable
        className="mt-2"
        dataSource={tableData}
        columns={columns}
        pagination={false}
        rowClassName={() => 'editable-row'}
        components={components}
        locale={{
          emptyText: <span />,
        }}
      />
    </React.Fragment>
  )
}
