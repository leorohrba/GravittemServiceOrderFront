/**
 * breadcrumb: Devolução obrigatória
 */
import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { apiMaterialRequest } from '@services/api'
import { fieldsValidationToast, handleAuthError } from '@utils'
import { Alert, message, Modal, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { RequiredDevolutionModalForm } from './RequiredDevolutionModalForm'

const RequiredDevolution = props => {
  const {
    form,
    modalVisible,
    items,
    toogleModalVisible,
    onChangeDevolution,
    manual,
    type,
    canBeUpdated,
  } = props

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [returnedItems, setReturnedItems] = useState([])
  const [alertMessages, setAlertMessages] = useState([])

  const ref = React.useRef()

  function refreshForm() {
    setLoading(true)
    setReturnedItems([])
    const filteredItems = items.filter(
      x =>
        ((type === 'Request' && x.actStatusCode === 'APLI') ||
          (type === 'ServiceOrder' && x.actStatusCode === 'UTLZ')) &&
        x.returnRequired,
    )
    if (manual && filteredItems.length === 0) {
      Modal.info({
        title: 'Atenção!',
        content:
          'Requisição não possui itens aplicados com a configuração de retorno obrigatório!',
        onOk: () => toogleModalVisible(),
      })
    }
    if (!manual && filteredItems.length === 0) {
      toogleModalVisible()
    }
    setReturnedItems(filteredItems)
    setLoading(false)
  }

  useEffect(() => {
    if (returnedItems.length > 0) {
      returnedItems.map(record =>
        form.setFieldsValue({
          [`quantityReturned_${record.serviceOrderPartId}`]: record.quantityReturned,
          [`observationReturned_${record.serviceOrderPartId}`]: record.observationReturned,
        }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedItems])

  const handleSave = e => {
    e && e.preventDefault()
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        saveDevolution()
      }
    })
  }

  async function saveDevolution() {
    setIsSaving(true)

    const devolutionBody = {
      items: [],
    }

    returnedItems.map(record =>
      devolutionBody.items.push({
        serviceOrderPartId: record.serviceOrderPartId,
        quantityReturned: form.getFieldValue(
          `quantityReturned_${record.serviceOrderPartId}`,
        ),
        observationReturned: form.getFieldValue(
          `observationReturned_${record.serviceOrderPartId}`,
        ),
      }),
    )

    try {
      const response = await apiMaterialRequest({
        method: 'PUT',
        url: `/api/Services/Devolution`,
        data: devolutionBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        onChangeDevolution()
        toogleModalVisible()
      } else {
        setAlertMessages(data.validationMessageList)

        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  const handleCancel = () => {
    toogleModalVisible()
  }

  return (
    <div>
      <Modal
        id="required-devolution-modal"
        visible={modalVisible}
        title={formatMessage({
          id: 'materialRequest.RequiredDevolution.requiredDevolution',
        })}
        centered
        onCancel={handleCancel}
        width="650px"
        bodyStyle={{ height: returnedItems.length > 0 ? 'auto' : '600px' }}
        footer={[
          <Button
            key="save"
            size="default"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            loading={isSaving}
            onClick={handleSave}
            disabled={!canBeUpdated}
            id="save-required-devolution"
          >
            {formatMessage({
              id: 'saveButton',
            })}
          </Button>,
        ]}
      >
        <div ref={ref}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}
        </div>

        <Spin size="large" spinning={loading}>
          <RequiredDevolutionModalForm
            form={form}
            modalVisible={modalVisible}
            items={items}
            returnedItems={returnedItems}
            refreshForm={refreshForm}
            type={type}
            manual={manual}
            canBeUpdated={canBeUpdated}
          />
        </Spin>
      </Modal>
    </div>
  )
}

RequiredDevolution.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  items: PropTypes.array,
  toogleModalVisible: PropTypes.bool,
  onChangeDevolution: PropTypes.func,
  manual: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
}

const WrappedRequiredDevolution = Form.create()(RequiredDevolution)

export default WrappedRequiredDevolution
