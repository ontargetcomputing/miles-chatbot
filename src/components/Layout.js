import styled from "styled-components"
import ChatInput from "./ChatInput"
import Button from "./Button"
import BotHeader from "./BotHeader"
import BotMessage from "./BotMessage"
import { useSelector } from "react-redux"
import Markdown from "react-markdown"

const LayoutWrapper = styled.div`
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  height:calc(100% - 196px);  
}
`
function Layout() {
  const { lexResponse } = useSelector((store) => store.lexClient)
  return (
    <>
      <LayoutWrapper>
        <BotHeader>Miles:</BotHeader>
        <div className="bp-md:w--90 p-10">
          <BotMessage>
            <Markdown>{lexResponse?.message}</Markdown>
          </BotMessage>
        </div>
        <div className="flex">
          <Button label="Online Services" />
          <Button label="Vehicle or Vessel Registration" />
          <Button label="Driver’s License/ID Card" />
          <Button label="Real ID" />
        </div>
      </LayoutWrapper>
      <ChatInput />
    </>
  )
}

export default Layout
