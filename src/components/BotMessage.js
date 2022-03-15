import propTypes from 'prop-types'
import styled from 'styled-components'
import BotHeader from './BotHeader'
const Message = styled.div`
  border-left: 0.15em solid ${props => props.theme.colors.yellow.cyellow};
  padding-left: 12px;
  && ul {
    margin-left:0px;
    list-style-type: none;
    margin-bottom: calc(var(--spacing-unit-2)*1);
  }
`
export default function BotMessage({ children }) {
  return (
    <div>
      <BotHeader>Miles:</BotHeader>
      <Message>{children}</Message>
    </div>
  )
}

BotMessage.defaultProps = {
  children: '',
}

BotMessage.propTypes = {
  children: propTypes.any,
}
