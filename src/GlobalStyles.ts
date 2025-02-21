import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  body {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: clamp(14px, 2.5vw, 18px); /* Fluid base font size */
  }
`;

export default GlobalStyles;
