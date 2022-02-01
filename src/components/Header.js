import styled from "styled-components"

const Banner = styled.header`
  display: flex;
  justify-content: center;
  height: 70px;
  align-items: center;
  background-color: ${(props) => props.theme.colors.blue.cblue};
`

function Header() {
  return (
    <Banner>
      <img src="./assets/images/chatbot-logo.svg" alt="logo" />
    </Banner>
  )
}

export default Header
