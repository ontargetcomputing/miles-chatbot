import styled from "styled-components"

const Banner = styled.header`
  display: flex;
  justify-content: center;
  height: 64px;
  align-items: center;
  background-color: ${(props) => props.theme.colors.blue.cblue};
`

function Header() {
  return <Banner />
}

export default Header
