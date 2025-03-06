import { Form } from '@ant-design/compatible'
import TableTransfer from '@components/TableTransfer'
import { customSort } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'

const leftTableColumns = [
  {
    dataIndex: 'name',
    title: 'Nome',
    sorter: (a, b) => customSort(a.name, b.name),
  },
]
const rightTableColumns = [
  {
    dataIndex: 'name',
    title: 'Nome',
    sorter: (a, b) => customSort(a.name, b.name),
  },
]

function NewGroupFormTree({
  form,
  collaboratorData,
  initialCollaboratorIds,
  disabled,
}) {
  const { getFieldDecorator } = form
  return (
    <div>
      <Form.Item>
        {getFieldDecorator('collaboratorIds', {
          valuePropName: 'targetKeys',
          initialValue: initialCollaboratorIds,
          rules: [
            {
              required: true,
              message: 'Informe pelo menos um colaborador para o grupo!',
            },
          ],
        })(
          <TableTransfer
            dataSource={collaboratorData}
            disabled={disabled}
            locale={{
              itemUnit: 'colaborador',
              itemsUnit: 'colaboradores',
              searchPlaceholder: 'Pesquise um colaborador',
            }}
            titles={['Todas os colaboradores', 'Novo grupo']}
            showSearch
            filterOption={(inputValue, item) =>
              item.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
          />,
        )}
      </Form.Item>
    </div>
  )
}

NewGroupFormTree.propTypes = {
  form: PropTypes.object,
  collaboratorData: PropTypes.array,
  initialCollaboratorIds: PropTypes.array,
  disabled: PropTypes.bool,
}

export default NewGroupFormTree
