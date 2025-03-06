import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import ReactModal from 'react-modal'

function CRMPersonModal(props) {
  const {
    visibleModal,
    setVisibleModal,
    form,
    clients,
    isNewPerson,
    buttonOrigin,
  } = props

  const [selectedPerson, setselectedPerson] = useState({})

  const customerId = form.getFieldValue('finalCustomerId')
  function closeModal() {
    setVisibleModal(false)
  }

  useEffect(() => {
    if (customerId !== undefined) {
      setselectedPerson(
        buttonOrigin === 'Contract'
          ? { personId: form.getFieldValue('contratantePersonId') }
          : clients.filter(r => r.customerId === customerId)[0],
      )
    }
  }, [form])

  const query = new URLSearchParams(window?.location?.search)
  const token = query.get('token')
  const processId = query.get('processId')

  const CRMUrl = `https://${
    process.env.UMI_ENV
  }-crm-ui-devsoftin-gravittem.vercel.app/CRM/PersonGrid?token=${token}&processId=${processId}&fromNewUI=${true}&personId=${
    isNewPerson ? 0 : selectedPerson?.personId
  }`

  return (
    <ReactModal
      className="flex flex-col"
      isOpen={visibleModal}
      onRequestClose={closeModal}
      contentLabel={isNewPerson ? 'Cadastrar Pessoa' : 'Alterar Pessoa'}
    >
      <div className="flex justify-end p-3">
      <Button type="primary" onClick={closeModal}>Fechar</Button>
      </div>
      <iframe className="w-screen h-screen" src={CRMUrl} />
    </ReactModal>
  )
}

export default CRMPersonModal
