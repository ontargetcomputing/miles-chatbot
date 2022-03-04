import { ThemeProvider } from "styled-components";
import PropTypes from 'prop-types';

export const theme = {
  colors: {
    blue: {
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
    yellow: {
      cyellow: '#FFD457',
      cyellowlight1: '#FDF881',
      cyellowdark:'#FFD76B'
    },
    black:{
      cblack:'#000000'
    },
    gray:{
      cgraylight3:'#C7C9CB'
    },
    orange: {
    corangedark1: '#EF6C42'
    }
  },
}

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

Theme.propTypes = {
  children: PropTypes.any,
}
export default Theme
