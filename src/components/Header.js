import styled from "styled-components"

const Banner = styled.header`
  display: flex;
  justify-content: center;
  height: 70px;
  align-items: center;
  background-color: ${(props) => props.theme.colors.blue.cblue};
`

const Image = styled.img`
height: 50px;
`

function Header() {
  const url = 'assets/images/chatbot-logo.svg'
  const path = process.env.REACT_APP_ASSETS_URL ? `${process.env.REACT_APP_ASSETS_URL}/${url}` : `./${url}`
  return (
    <Banner>
      <Image src={`${path}`} alt="logo" />
    </Banner>
  )
}

export default Header
