import styled from 'styled-components'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { InputText, BUTTON_STYLE_PRIMARY } from '@ca-dmv/core'
import ActionButton from './Button'
import { searchQuery } from '../connectors/lexClient'

const StartHereWrapper = styled.div`
  height: 65px;
  padding: 0px 14px;
  background-color: var(--c-gray-dark-1);
  box-shadow: 0px -2px 12px rgba(0, 0, 0, 0.25);
  .cb-input-container {
    flex: 1 1 0;
  }
`

const Button = styled(ActionButton)`
  border-radius: var(--border-radius);
  padding: 0 var(--spacing-unit-20);
  height: 38px;
  margin-left: 10px;

`

function ChatInput() {
  const dispatch = useDispatch()
  const [term, setSearchTerm] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(searchQuery(term))
  }
  return (
    <form onSubmit={e => handleSubmit(e)}>
      <StartHereWrapper className='flex flex--align-center'>
        <InputText
          onChange={e => setSearchTerm(e)}
          hideLabel
          placeholder='Start Chart'
          inputClass=''
          value={term}
          containerClass='cb-input-container'
        />
        <Button
          label='Start'
          onClick={() => dispatch(searchQuery(term))}
          btnStyle={BUTTON_STYLE_PRIMARY}
          buttonClass='ml-10 mt-3 mr-30'
        />
      </StartHereWrapper>
    </form>
  )
}

export default ChatInput
