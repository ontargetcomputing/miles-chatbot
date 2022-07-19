import { createGlobalStyle } from 'styled-components'
import { useDispatch } from 'react-redux'
import Header from './components/Header'
import Footer from './components/Footer'
import Layout from './components/Layout'
import Theme from './Theme'
import { useEffect } from 'react'
import { leXTextCall } from './connectors/lexClient'
import Notifier from './Notifier'
import { SEARCH_QUERY } from './helper/enum'

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

  useEffect(async () => {
    if(localStorage.getItem('topic')){
      await localStorage.clear();
      dispatch(leXTextCall(SEARCH_QUERY.BOOTSTRAP, true))
      dispatch(leXTextCall(SEARCH_QUERY.LANGUAGE, true))
    } else {
      dispatch(leXTextCall(SEARCH_QUERY.BOOTSTRAP, true))
      dispatch(leXTextCall(SEARCH_QUERY.LANGUAGE, true))
    }
  }, [])

  return (
    <Theme>       
      <GlobalStyle />
      <Header />
      <Layout />
      <Footer />
      <Notifier/> 
    </Theme>
  )
}

export default App
