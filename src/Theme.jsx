import { ThemeProvider } from "styled-components";
import PropTypes from 'prop-types';

const theme = {
  colors: {
    cblue: "#0077c8",
    cbluelight1: "#64c7fa",
    cbluelight2: "#b5d1e1",
    cbluelight3: "#edf4f8",
    cbluelight4: "#f0f9ff",
    cbluelight5: "#fafcfe",
    cbluedark3: "#394655",
    cbluedark2: "#163159",
    cbluedark1: "#0b669e",
  },
}

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

Theme.propTypes = {
  children: PropTypes.any,
}
export default Theme
