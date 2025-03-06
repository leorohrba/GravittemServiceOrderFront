import { QuestionCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import PropTypes from 'prop-types'

const { confirm } = Modal

const CancelRequestModal = handleCancel => {
  confirm({
    title: 'Cancelar solicitação',
    content:
      'Deseja realmente cancelar a solicitação de compra dos itens selecionados?',
    cancelText: 'Não',
    okText: 'Sim',
    okType: 'danger',
    onOk: () => handleCancel(),
    okButtonProps: {
      size: 'large',
    },
    cancelButtonProps: {
      size: 'large',
    },
    icon: <QuestionCircleOutlined />,
  })
}

CancelRequestModal.propTypes = {
  handleCancel: PropTypes.any,
}

export default CancelRequestModal
