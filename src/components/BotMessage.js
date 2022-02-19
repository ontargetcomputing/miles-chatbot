import propTypes from "prop-types"
import styled from "styled-components"

const Message = styled.div`
  border-left: 0.15em solid ${(props) => props.theme.colors.yellow.cyellow};
  padding: 15px 10px 0 15px;
  margin-bottom: 0;
  && ul {
    list-style-type: none;
  }
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
