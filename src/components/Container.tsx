import { css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const dynamicStyle = ({ height, width, x, y, fullWidth, visible }: Shape & { fullWidth: number; visible: boolean }) =>
  // if the vw is greater than the paneDimensions, need to add half of the diference onto the x value
  css`
    height: ${height}px;
    width: ${width}px;
    visibility: ${visible ? 'visible' : 'hidden'};
    animation: ${fadeIn} 0.75s ease-in;
    transform: translate3d(calc(${x}px + calc(calc(100vw - ${fullWidth}px) / 2)), ${y}px, 0);
  `

const Container = styled.div`
  ${dynamicStyle};
  position: absolute;
  background: black;
`

export default Container
