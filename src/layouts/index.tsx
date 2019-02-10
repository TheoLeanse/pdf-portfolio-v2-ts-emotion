import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

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
  const x = parseInt(String(Math.random() * pane.width), 10)
  const y = parseInt(String(Math.random() * pane.height), 10)

  return placedItems.some(item => doesOverlap({ ...itemDimensions, x, y }, item))
    ? availablePosition(itemDimensions, pane, placedItems)
    : { ...itemDimensions, x, y }
}

const size = { height: 200, width: 175 }
const paneDimensions = { height: 500, width: 1000 }

const positions = (count: number) => Array.from(Array(count)).reduce(acc => acc.concat(availablePosition(size, paneDimensions, acc)), [])

// split the number of PDFs present into groups of 4 (or 5) and create components with each group,
// alternating the svg backgrounds provided

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
          {/* we want a pause before the pdfs at positions appear */}
          {positions(4).map(({ height, width, x, y }) => (
            <div
              key={`${x}-${y}`}
              style={{ position: 'absolute', background: 'black', height, width, transform: `translate3d(${x}px, ${y}px, 0)` }}
            />
          ))}
        </LayoutMain>
      </LayoutRoot>
    )}
  />
)

export default IndexLayout
