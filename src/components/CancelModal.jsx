import { Modal } from 'antd'
import PropTypes from 'prop-types'

const { confirm } = Modal

const CancelModal = (content, handleSave) => {
  confirm({
    title: content.title,
    content: content.description,
    onOk: () => handleSave(content.action),
    cancelText: 'Não',
    okText: 'Sim',
    okType: 'danger',
    okButtonProps: {
      size: 'large',
    },
    cancelButtonProps: {
      size: 'large',
    },
  })
}

CancelModal.propTypes = {
  content: PropTypes.object,
  handleSave: PropTypes.any,
}

export default CancelModal
