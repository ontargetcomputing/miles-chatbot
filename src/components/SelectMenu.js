import { SelectMenu as DMVSelect } from '@ca-dmv/core';
import propTypes from 'prop-types';

export default function SelectMenu({ className, containerClass, ...props }) {
  return  <DMVSelect containerClass={`${className} ${containerClass}`} {...props} />
}

SelectMenu.defaultProps = {
    className: "",
    containerClass: "",
}

SelectMenu.propTypes = {
    className: propTypes.string,
    containerClass: propTypes.string,
}