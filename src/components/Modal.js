import { Modal as DMVModal } from '@ca-dmv/modal'
import PropTypes from 'prop-types';

const Modal = ({ show, children, ...props }) => {
  if (!show) {
    return null;
  }

  return <DMVModal {...props}>
    {children}
  </DMVModal>
}

Modal.propTypes={
  show:PropTypes.bool,
  children:PropTypes.any,
  props:PropTypes.any
}
export default Modal;