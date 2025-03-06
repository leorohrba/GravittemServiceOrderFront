import React, { useEffect, useRef } from 'react'
import { NewAutoComplete } from '@components/refactored'
import { Button, Col, Row } from 'antd'
import { hasSome } from '@utils/rescript/Generics.bs'
import { notNullUndefined } from '@utils/generics'

function CRMAutoComplete(props) {
  const {
    form,
    contractors,
    setContractors,
    apiCRM,
    handleContractPerson,
    responsibleId,
    getContractorEdit,
    hasPermission,
    userPermissions,
    openNewPersonModal,
    editCRMPerson,
    hasSelectedPerson,
  } = props

  const dataList = useRef(null)

  const hasSelectedContractor = hasSome(
    form.getFieldValue('contratantePersonId'),
  )
    async function getData() {
    dataList.current = await getContractorEdit(responsibleId)
    setContractors(dataList.current)
  }

  useEffect(() => {
    if (hasSelectedPerson && notNullUndefined(contractors)) {
      form.setFieldsValue({ contratantePersonId: contractors[0]?.personId })
    }
  }, [contractors, hasSelectedPerson])

  useEffect(() => {
    if (responsibleId !== 0) {
      getData()
    }
  }, [responsibleId])

  return (
    <>
      <Col span={11}>
        <NewAutoComplete
          form={form}
          source={contractors}
          setSource={setContractors}
          fieldName="contratantePersonId"
          placeholder="Digite o nome do contratante"
          serviceApi={apiCRM}
          api="api/CRM/Person"
          defaultParams={{ getPersonDetails: true }}
          paramName="name"
          label="Contratante (Escritório engenharia)"
          required
          recordId="personId"
          recordDescription="name"
          nameList="person"
          onChange={handleContractPerson}
        />
      </Col>
      {hasPermission(userPermissions, 'Include') ? (
        <Row align="bottom" gutter={3} className="">
          <Col flex={1}>
            <Button
              size="small"
              className="mb-6"
              icon
              onClick={() => openNewPersonModal()}
            >
              <i className=" fa fa-file-text-o" aria-hidden="true"></i>
            </Button>
          </Col>

          <Col flex={1}>
            <Button
              disabled={!hasSelectedContractor}
              size="small"
              className="mb-6"
              icon
              onClick={() => editCRMPerson('Contract')}
            >
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </Button>
          </Col>
        </Row>
      ) : null}
    </>
  )
}

export default CRMAutoComplete
