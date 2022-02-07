import styled from "styled-components"
import ChatInput from "./ChatInput"
import Button from "./Button"
import BotHeader from "./BotHeader"
import BotMessage from "./BotMessage"

const LayoutWrapper = styled.div`
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  height:calc(100% - 196px);  
}
`
function Layout() {
  return (
    <>
      <LayoutWrapper>
        <BotHeader>Miles:</BotHeader>
        <div className="bp-md:w--90 p-10">
          <BotMessage>
            Hello, Im Miles, the California DMVs Virtual Assistant. Im here to answer general DMV related questions. I
            am pretty smart, but sometimes I hit a bump in the road. If I cannot answer your question, type agent or you
            will be prompted to chat with an agent during normal business hours, 8 a.m.–5 p.m. (Wednesday 9 a.m.-5
            p.m.).
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
