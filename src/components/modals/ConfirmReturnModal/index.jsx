import { Modal } from 'antd'
import PropTypes from 'prop-types'
import router from 'umi/router'

const { confirm } = Modal

const ConfirmReturnModal = (handleSubmit, setVisible, isModal) => {
  confirm({
    title: 'Deseja salvar as alterações?',
    content: 'As alterações serão perdidas se você não salvar',
    onOk: () => handleSubmit(),
    onCancel: () => (isModal ? setVisible(false) : router.goBack()),
    cancelText: 'Não',
    okText: 'Sim',
    okButtonProps: { size: 'large' },
    cancelButtonProps: { size: 'large' },
  })
}

ConfirmReturnModal.propTypes = {
  handleSubmit: PropTypes.any,
  setVisible: PropTypes.any,
  isModal: PropTypes.any,
}

export default ConfirmReturnModal
