import { createGlobalStyle } from 'styled-components'
import { useDispatch } from 'react-redux'
import Header from './components/Header'
import Footer from './components/Footer'
import Layout from './components/Layout'
import Theme from './Theme'
import { useEffect } from 'react'
import { leXTextCall } from './connectors/lexClient'

const GlobalStyle = createGlobalStyle`
html, body, #root, .content-container{
  height:100%;
  width:100%;

  .btn--close{
    background-color: white;
    border-color: #d3d2d2;
    padding:5px;
    svg {
      fill:#0077c8;
      width:20px;

    }

    .error input{
      border-color: ${props => props.theme.colors.red.cred};
    }
  }
}

#root{
  display: flex;
  flex-flow: column;
}

.cb-disabled {
  input, button, a{
    opacity:0.5;
    user-select: none;    
    pointer-events: none;
  }
}
`

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const language = 'English'
    dispatch(leXTextCall(language, true))
  }, [])

  return (
    <Theme>       
      <GlobalStyle />
      <Header />
      <Layout />
      <Footer />
    </Theme>
  )
}

export default App
