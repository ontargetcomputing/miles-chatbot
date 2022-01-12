import styled from "styled-components"
import { Button, BUTTON_STYLE_SECONDARY } from "@ca-dmv/core"

const LayoutWrapper = styled.div`
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 95%;
}
`

const MilesWidget = styled.p`
  width: max-content;
  height: 24px;
  padding: 1px 9px;
  color: #203376;
  background: ${(props) => props.theme.colors.yellow.cyellow};
  border-radius: 5px;
`

const BotLayout = styled.div`
  display: flex;
  flex-direction: row;
`

const BotMessage = styled.p`
  border-left: 0.15em solid ${(props) => props.theme.colors.yellow.cyellow};
  padding: 15px;
`

const ActionButtons = styled.div`
  display: flex;
  width: 100%;
  margin: 20px;
`

const ActionButton = styled(Button)`
  border: 2px solid red;
`

function Layout() {
  return (
    <LayoutWrapper>
      <MilesWidget>Miles:</MilesWidget>
      <BotLayout className="bp-md:w--90 p-10">
        <BotMessage>
          Hello, Im Miles, the California DMVs Virtual Assistant. Im here to answer general DMV related questions. I am
          pretty smart, but sometimes I hit a bump in the road. If I cannot answer your question, type agent or you will
          be prompted to chat with an agent during normal business hours, 8 a.m.–5 p.m. (Wednesday 9 a.m.-5 p.m.).
        </BotMessage>
      </BotLayout>
      <ActionButtons>
        <ActionButton label="vikas" btnStyle={BUTTON_STYLE_SECONDARY} />
        {/* <Button label="Primary" />
        <Button label="Primary" />
        <Button label="Primary" />
        <Button label="Primary" /> */}
      </ActionButtons>
    </LayoutWrapper>
  )
}

export default Layout
