import { Button as DMVButton, BUTTON_STYLE_SECONDARY } from '@ca-dmv/core'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Button = ({ className, buttonClass, btnStyle, ...props }) => (
  <DMVButton
    btnStyle={btnStyle}
    buttonClass={`cb-button ${className} ${buttonClass}`}
    {...props}
  />
)

Button.defaultProps = {
  className: '',
  buttonClass: '',
  btnStyle: BUTTON_STYLE_SECONDARY,
}

Button.propTypes = {
  className: PropTypes.string,
  buttonClass: PropTypes.string,
  btnStyle: PropTypes.string,
}

const StyledButton = styled(Button)`
  margin: 4px;
  @media (max-width: 600px) {
    margin: 7.5px 4px;
    padding: 10px 15px;
  }
  @media (max-width: 350px) {
    padding: 5px 8px;
    margin: 5px 3px;
  }
`

export default function ActionButton(props) {
  return <StyledButton {...props} />
}
