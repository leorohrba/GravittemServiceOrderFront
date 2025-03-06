import React from 'react'
import { Button, Tooltip, Row } from 'antd'
import { useNewServiceContext } from '../context/newServiceContext'

const NewServiceButton = () => {
  const { handleCancelForm } = useNewServiceContext()

  return (
    <React.Fragment>
      <Row>
        <Tooltip title="Limpar campos do formulário">
          <Button onClick={handleCancelForm} shape="rond">
            <i className="fa fa-plus mr-3" />
            Novo serviço
          </Button>
        </Tooltip>
      </Row>
    </React.Fragment>
  )
}

export default NewServiceButton
