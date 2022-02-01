import propTypes from "prop-types";
import styled from "styled-components";

const Header = styled.p`
width: max-content;
height: 24px;
padding: 1px 9px;
color: #203376;
background: ${(props) => props.theme.colors.yellow.cyellow};
border-radius: 5px;
`;


export default function BotHeader({children}) {
   return <Header>{children}</Header>
}

BotHeader.defaultProps = {
    children: ""
}

BotHeader.propTypes = {
    children: propTypes.any
}