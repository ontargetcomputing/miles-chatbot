import styled from "styled-components"
import { Button } from "./Button"
import SelectMenu from "./SelectMenu"
import { Icon, ICON_ARROW } from "@ca-dmv/core"
import { useDispatch, useSelector } from "react-redux"
import { setActionType, setLanguage } from "../ducks/lexClient"
import { ACTION_TYPE } from "../helper/enum"

const StyledTitle = styled.h4`
  margin-bottom: 35px;
  color: ${(props) => props?.theme?.colors?.blue?.cbluedark1};
`

const StyledSubTitle = styled.h6`
  margin-bottom: 35px;
  color: ${(props) => props?.theme?.colors?.blue?.cbluedark1};
`

const StyledArrowButton = styled(Button)`
  background-color: ${(props) => props?.theme?.colors?.yellow?.cyellowdark};
  color: ${(props) => props?.theme?.colors?.black?.cblack};
  width: 63px;
  height: 64px;
  padding: 0px;
  margin-top: 35px;
  border: 0px;
  :hover,
  :focus {
    background-color: ${(props) => props?.theme?.colors?.yellow?.cyellowdark};
    color: ${(props) => props?.theme?.colors?.black?.cblack};
  }
`

const StyledSelectMenu = styled(SelectMenu)`
  width: 64%;
  border-color: ${(props) => props?.theme?.colors?.gray?.cgraylight3};
  :focus,
  :hover {
    border-color: ${(props) => props?.theme?.colors?.gray?.cgraylight3};
  }
  select {
    color: ${(props) => props?.theme?.colors?.black?.cblack};
    :focus,
    :hover {
      color: ${(props) => props?.theme?.colors?.black?.cblack};
    }
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`

const IconStyle = styled(Icon)`
  stroke: black;
  transform: rotate(180deg);
  height: 30px;
  width: 30px;
`;

export default function ChangeLanguage() {
    const dispatch = useDispatch();
    const { language } = useSelector(store => store.lexClient);
    const languages = [
        { value: "ar", label: "Arabic" },
        { value: "hy", label: "Armenian" },
        { value: "zh-TW", label: "Chinese (Traditional)" },
        { value: "en", label: "English" },
        { value: "hi", label: "Hindi" },
        { value: "ja", label: "Japanese" },
        { value: "ko", label: "Korean" },
        { value: "fa", label: "Persian" },
        { value: "ru", label: "Russian" },
        { value: "es", label: "Spanish" },
        { value: "vi", label: "Vietnamese" },
        { value: "tl", label: "Tagalog" },
        { value: "th", label: "Thai" },
    ]

    const onChange = (ln) => dispatch(setLanguage(ln));

    return (
        <div className="flex flex--col flex--align-center">
            <StyledTitle>Change Language</StyledTitle>
            <StyledSubTitle className="text--center">
                SELECT YOUR PREFERRED LANGUAGE FROM THE LIST BELOW TO GET STARTED.
            </StyledSubTitle>
            <StyledSelectMenu
                selectClass="w-100 "
                onChange={onChange}
                options={languages}
                selectedValue={language}
                hideLabel
            />
            <StyledArrowButton onClick={() => dispatch(setActionType(ACTION_TYPE.DEFAULT))}>
                <IconStyle icon={ICON_ARROW} />
            </StyledArrowButton>
        </div>
    )
}