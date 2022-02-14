import { Button as DMVButton, BUTTON_STYLE_SECONDARY } from "@ca-dmv/core"
import styled from "styled-components"
import PropTypes from "prop-types"
import propTypes from "prop-types"

function Button({ className, buttonClass, btnStyle, ...props }) {
  return <DMVButton btnStyle={btnStyle} buttonClass={`cb-button ${className} ${buttonClass}`} {...props} />
}

Button.defaultProps = {
  className: "",
  buttonClass: "",
  btnStyle: BUTTON_STYLE_SECONDARY,
}

Button.propTypes = {
  className: PropTypes.string,
  buttonClass: propTypes.string,
  btnStyle: propTypes.string,
}

const StyledButton = styled(Button)`
  margin: 4px;
`

export default function ActionButton(props) {
  return <StyledButton {...props} />
}
