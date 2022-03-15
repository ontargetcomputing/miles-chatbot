import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InputText, BUTTON_STYLE_PRIMARY } from '@ca-dmv/core'
import ActionButton from './Button'
import { searchQuery } from '../connectors/lexClient'
import { LEXTHREAD_PROPS, TOPIC } from '../helper/enum'
import { InputUtil } from '../helper/inputUtil'
import { Util } from '../helper/Util'

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

function ChatInput() {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(true);
  const [term, setSearchTerm] = useState('');
  const { lexThread } = useSelector(store => store.lexClient);
  const [lexTopic, setTopic] = useState("");
  const pattern = {
    [TOPIC.PHONE_NUMBER]: '[0-9]*'
  }
  const checkInputValidation = (topic, data = null) => {
    data = data || term;

    if (topic === TOPIC.FIRST_NAME || topic === TOPIC.LAST_NAME) {
      return isRequired(data);
    } else if (topic === TOPIC.EMAIL) {
      return isValidEmail(data);
    } else if (topic === TOPIC.PHONE_NUMBER) {
      return isValidPhoneNumber(data);
    }
    setErrorMsg("");
  }

  const isRequired = (data) => {
    if (!InputUtil.isRequired(data)) {
      setErrorMsg("Input field cannot be empty");
      return false;
    }
    setErrorMsg("");
    return true;
  }

  const isValidEmail = (data) => {
    if (!InputUtil.isValidEmail(data)) {
      setErrorMsg("Please enter valid email address");
      return false;
    }
    setErrorMsg("");
    return true;
  }

  const isValidPhoneNumber = (data) => {
    if (!InputUtil.isValidPhone(data)) {
      setErrorMsg("Please enter valid phone number");
      return false;
    }
    setErrorMsg("");
    return true;
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

  const handleSubmit = e => {
    e.preventDefault();
    setTopic("");
    setErrorMsg("");
    setShowError(false);
    dispatch(searchQuery(term))
    setSearchTerm('')
  }

  useEffect(() => {
    setShowError(true);
    checkInputValidation(lexTopic);
  }, [term])

  const onChange = data => setSearchTerm(data)

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <StartHereWrapper className={`flex flex--align-start ${errorMsg && showError ? "bot-error" : ""}`}>
        <InputText
          pattern={pattern[lexTopic] || null}
          hideError={!showError}
          error={showError ? errorMsg : ""}
          onChange={onChange}
          hideLabel
          placeholder='Start Chart'
          inputClass=''
          value={term}
          containerClass="cb-input-container"
        />
        <Button
          disabled={errorMsg ? true : false}
          isSubmit
          label='Start'
          btnStyle={BUTTON_STYLE_PRIMARY}
        />
      </StartHereWrapper>
    </form>
  )
}

export default ChatInput
