import propTypes from "prop-types"
import styled from "styled-components"

const Message = styled.p`
  border-left: 0.15em solid ${(props) => props.theme.colors.yellow.cyellow};
  padding: 15px 15px 0 15px;
  margin-bottom: 0;
`
export default function BotMessage({ children }) {
  return <Message>{children}</Message>
}

BotMessage.defaultProps = {
  children: "",
}

BotMessage.propTypes = {
  children: propTypes.any,
}
