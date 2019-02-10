import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { chunk } from 'lodash/fp'
import 'modern-normalize'
import '../styles/normalize'

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

const pdfs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20]

// split the number of PDFs present into groups of 4 (or 5) and create components with each group,
// alternating the svg backgrounds provided
const PdfsInSections = () => chunk(4, pdfs).map((pdfChunk, i) => <Section odd={isOdd(i)} />)

const Section = ({ odd }) => {
  return (
    <div style={{ position: 'relative', height: paneDimensions.height, background: odd ? 'papayawhip' : 'lightgray' }}>
      {positions(4).map(({ height, width, x, y }: Shape) => (
        <div
          key={`${x}-${y}`}
          style={{ height, width, position: 'absolute', background: 'black', transform: `translate3d(${x}px, ${y}px, 0)` }}
        />
      ))}
    </div>
  )
}

console.log('PDFs in sections', PdfsInSections)

// pause before rendering pdfs - use suspense with a timeout resource to have them all appear at the same time?

// button to an about me page - fixed position

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
        </LayoutMain>
      </LayoutRoot>
    )}
  />
)

export default IndexLayout
