import { Button as DMVButton, BUTTON_STYLE_SECONDARY } from "@ca-dmv/core"
import styled from "styled-components"
import PropTypes from "prop-types"
import propTypes from "prop-types"

//ClassName property is required for styled component
//ButtonClass property is Button own property
function Button({ className, buttonClass, btnStyle, ...props }) {
  return (
    <DMVButton
      btnStyle={btnStyle || BUTTON_STYLE_SECONDARY}
      buttonClass={`cb-button ${className} ${buttonClass}`}
      {...props}
    />
  )
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
  padding: ${(props) => (props.sm ? "10px 15px" : null)};
`

export default function ActionButton(props) {
  return <StyledButton {...props} />
}
