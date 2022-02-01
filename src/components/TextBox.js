import { TextBox as DMVTextBox, TextBox_STYLE_SECONDARY } from "@ca-dmv/core"
import styled from "styled-components"
import PropTypes from "prop-types"
import propTypes from "prop-types"

//ClassName property is required for styled component
//TextBoxClass property is TextBox own property
function TextBox({ className, TextBoxClass, btnStyle, ...props }) {
  return (
    <DMVTextBox
      btnStyle={btnStyle || TextBox_STYLE_SECONDARY}
      TextBoxClass={`cb-TextBox ${className} ${TextBoxClass}`}
      {...props}
    />
  )
}

TextBox.defaultProps = {
  className: "",
  TextBoxClass: "",
  btnStyle: TextBox_STYLE_SECONDARY,
}

TextBox.propTypes = {
  className: PropTypes.string,
  TextBoxClass: propTypes.string,
  btnStyle: propTypes.string,
}

const StyledTextBox = styled(TextBox)`
  margin: 4px;
  ${(props) =>
    props.sm
      ? `@media(max-width:600px){
  padding:  15px;   
  margin:0 4px;
  font-size:12px;
}   
`
      : ""}
`

export default function ActionTextBox(props) {
  return <StyledTextBox {...props} />
}
