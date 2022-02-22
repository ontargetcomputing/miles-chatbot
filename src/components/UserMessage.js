import propTypes from 'prop-types'
import styled from 'styled-components'



const MessageLayout = styled.div`
margin-top: 10px;
display:flex;
flex-direction: column;
align-items: end;
`

const Message = styled.p`
padding: 8px;
border-right: 0.20em solid ${props => props.theme.colors.blue.cbluedark2};
`

const BotHeader = styled.p`
  width: max-content;
  height: 30px;
  padding: 4px 15px;
  color: #fff;
  background: ${props => props.theme.colors.blue.cbluedark2};
  border-radius: 5px;
`
export default function UserMessage({ children }) {
  return (
    <MessageLayout>
      <BotHeader>Me:</BotHeader>
      <Message>{children}</Message>
    </MessageLayout>
  )
}

UserMessage.defaultProps = {
  children: '',
}

UserMessage.propTypes = {
  children: propTypes.any,
}
