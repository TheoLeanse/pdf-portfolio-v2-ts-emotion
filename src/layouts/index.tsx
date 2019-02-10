import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'
import { StaticQuery, graphql, Link } from 'gatsby'
import { chunk } from 'lodash/fp'
import 'modern-normalize'
import '../styles/normalize'

import containerShip from '../container-ship.svg'
import workersClub from '../workers-club.svg'

import LayoutRoot from '../components/LayoutRoot'
import LayoutMain from '../components/LayoutMain'

type StaticQueryProps = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
}

type Shape = { x: number; y: number; height: number; width: number }

const getCorners = ({ x, y, width, height }: Shape) => [[x, y], [x + width, y], [x, y + height], [x + width, y + height]]

const pointIsInsideShape = ([pointX, pointY]: number[], { x: shapeX, y: shapeY, height, width }: Shape) => {
  const isInXRange = shapeX <= pointX && pointX <= shapeX + width
  const isInYRange = shapeY <= pointY && pointY <= shapeY + height
  return isInXRange && isInYRange
}

const doesOverlap = (dimensionsA: Shape, dimensionsB: Shape) =>
  getCorners(dimensionsA).some(corner => pointIsInsideShape(corner, { ...dimensionsB }))

const availablePosition = (
  itemDimensions: { height: number; width: number },
  pane: { height: number; width: number },
  placedItems: Shape[] = []
): any => {
  const x = parseInt(String(Math.random() * (pane.width - itemDimensions.width)), 10)
  const y = parseInt(String(Math.random() * (pane.height - itemDimensions.height)), 10)

  return placedItems.some(item => doesOverlap({ ...itemDimensions, x, y }, item))
    ? availablePosition(itemDimensions, pane, placedItems)
    : { ...itemDimensions, x, y }
}

const size = { height: 200, width: 175 }
const paneDimensions = { height: 750, width: 1100 }

const positions = (count: number) => Array.from(Array(count)).reduce(acc => acc.concat(availablePosition(size, paneDimensions, acc)), [])

const isOdd = (n: number) => n % 2 !== 0

const dynamicStyle = ({ height, width, x, y }: Shape) =>
  // if the vw is greater than the paneDimensions, need to add half of the diference onto the x value
  css`
    height: ${height}px;
    width: ${width}px;
    transform: translate3d(calc(${x}px + calc(calc(100vw - ${paneDimensions.width}px) / 2)), ${y}px, 0);
  `

const Container = styled.div`
  ${dynamicStyle};
  position: absolute;
  background: black;
`

const PdfsInSections = () => {
  const [pdfs, setPdfs] = useState([])
  useEffect(() => {
    setPdfs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20, 21, 22])
  }, [])
  return chunk(4, pdfs).map((pdfChunk, i) => (
    <Section odd={isOdd(i)} key={pdfChunk[0]}>
      {positions(pdfChunk.length).map((shape: Shape) => (
        <Container key={`${shape.x}-${shape.y}`} {...shape} />
      ))}
    </Section>
  ))
}

interface SectionProps {
  odd: boolean
  children: React.Component
}

const ClubBackground = styled.div`
  position: relative;
  height: ${paneDimensions.height}px;
  background-image: url(${workersClub});
  background-position: center;
  background-repeat: no-repeat;
`
const ShipBackground = styled.div`
  position: relative;
  height: ${paneDimensions.height}px;
  background-image: url(${containerShip});
  background-position: center;
  background-repeat: no-repeat;
`

const Section = ({ odd, children }: SectionProps) =>
  odd ? <ClubBackground>{children}</ClubBackground> : <ShipBackground>{children}</ShipBackground>

// pause before rendering pdfs - use suspense with a timeout resource to have them all appear at the same time?

const FixedRedButton = styled.button`
  font-family: Helvetica, Arial, Sans-serif;
  position: fixed;
  bottom: 50px;
  padding: 15px;
  background-color: crimson;
  border: none;
  font-size: 24px;
  font-style: italic;
  width: ${size.width + 150}px;
  color: white;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
`

const IndexLayout: React.SFC = ({ children }) => (
  <StaticQuery
    query={graphql`
      query IndexLayoutQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={(data: StaticQueryProps) => (
      <LayoutRoot>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: data.site.siteMetadata.description },
            { name: 'keywords', content: 'gatsbyjs, gatsby, javascript, sample, something' }
          ]}
        />
        <LayoutMain>
          <PdfsInSections />
          <Link to="/more">
            <FixedRedButton>T J Watson</FixedRedButton>
          </Link>
        </LayoutMain>
      </LayoutRoot>
    )}
  />
)

export default IndexLayout
