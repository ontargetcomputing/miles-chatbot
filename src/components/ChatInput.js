/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InputText, BUTTON_STYLE_PRIMARY } from '@ca-dmv/core'
import ActionButton from './Button'
import { searchQuery } from '../connectors/lexClient'
import { LEXTHREAD_PROPS, TOPIC } from '../helper/enum'
import { Util } from '../helper/Util'
import { setIsFeedbackUpdated, setUserDetails, disableInputField } from '../ducks/lexClient'
import { isRequired, isValidEmail, isValidPhoneNumber } from '../helper/Util'

const StartHereWrapper = styled.div`
  height: 65px;
  padding: 10px 14px 0px 14px;

  background-color: var(--c-gray-dark-1);
  box-shadow: 0px -2px 12px rgba(0, 0, 0, 0.25);
  .cb-input-container {
    flex: 1 1 0;
  }

  &.bot-error{
    height: 83px;    
  }
`

const Button = styled(ActionButton)`
  border-radius: var(--border-radius);
  padding: 0 var(--spacing-unit-20);
  height: 38px;
  margin-left: 10px;

`

const Form = styled.form`
margin-block-end: 0em !important;
` 

function ChatInput() {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(true);
  const [term, setSearchTerm] = useState('');
  const { lexThread, isLoading, isFeedbackUpdated, disableInput } = useSelector(store => store.lexClient);
  const [lexTopic, setTopic] = useState("");
  const pattern = {
    [TOPIC.PHONE_NUMBER]: '[0-9]*'
  }
  const checkInputValidation = (topic, data = null) => {
    data = data || term;

    if (topic === TOPIC.FIRST_NAME || topic === TOPIC.LAST_NAME) {
      return isRequired(data, setErrorMsg);
    } else if (topic === TOPIC.EMAIL) {
      return isValidEmail(data, setErrorMsg);
    } else if (topic === TOPIC.PHONE_NUMBER) {
      return isValidPhoneNumber(data, setErrorMsg);
    }
    setErrorMsg("");
  }

  useEffect(() => {
    setShowError(false);
    const newTopic = Util.getPropsFromArray(LEXTHREAD_PROPS.TOPIC, lexThread);
    checkInputValidation(newTopic);
    setTopic(newTopic);
  }, []);

  useEffect(() => {
    setShowError(false);
    const newTopic = Util.getPropsFromArray(LEXTHREAD_PROPS.TOPIC, lexThread);
    checkInputValidation(newTopic);
    setTopic(newTopic);
  }, [lexThread]);

  const handleSubmit = () => {
    setTopic("");
    setErrorMsg("");
    setShowError(false);
    dispatch(searchQuery(term))
    isFeedbackUpdated && dispatch(setIsFeedbackUpdated(false));
    (lexTopic === TOPIC.FIRST_NAME || lexTopic === TOPIC.LAST_NAME) && dispatch(setUserDetails({[lexTopic]:term}));
    (lexTopic === TOPIC.PHONE_NUMBER) && dispatch(disableInputField(true))
    setSearchTerm('')
  }

  useEffect(() => {
    setShowError(true);
    checkInputValidation(lexTopic);
  }, [term])

  const onChange = data => setSearchTerm(data)
  const disableBtn = errorMsg || isLoading || disableInput
  return (
    <Form onSubmit={e => {
      e.preventDefault()
      !disableBtn && handleSubmit(e)
    }} >
      <StartHereWrapper className={`flex flex--align-start ${errorMsg && showError &&  "bot-error"}`}>
        <InputText
          pattern={pattern[lexTopic] || null}
          hideError={!showError}
          error={showError && errorMsg}
          onChange={onChange}
          hideLabel
          placeholder='Start Chat'
          inputClass=''
          value={term}
          containerClass="cb-input-container"
          disabled={disableInput}
        />
        <Button
          disabled={disableBtn}
          isSubmit
          label='Send'
          btnStyle={BUTTON_STYLE_PRIMARY}
        />
      </StartHereWrapper>
    </Form>
  )
}

export default ChatInput
