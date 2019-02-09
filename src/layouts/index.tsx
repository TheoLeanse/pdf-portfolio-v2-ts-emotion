import * as React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import 'modern-normalize'
import '../styles/normalize'

import Header from '../components/Header'
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

const dimensionRange = (extension: number, start: number) => Array.from(Array(extension)).map((x, i) => i + start)

const arrayIncludesArray = (arrayToCheck: number[], arrayContaining: number[][]) =>
  arrayContaining.some(array => array.every(item => arrayToCheck.includes(item)))

const doesOverlap = (
  dimensionsA: { height: number; width: number; x: number; y: number },
  dimensionsB: { height: number; width: number; x: number; y: number }
) => {
  const itemAXRange = dimensionRange(dimensionsA.height, dimensionsA.x)
  const itemAYRange = dimensionRange(dimensionsA.width, dimensionsA.y)

  const itemBXRange = dimensionRange(dimensionsB.height, dimensionsB.x)
  const itemBYRange = dimensionRange(dimensionsB.width, dimensionsB.y)

  const tupleA = itemAXRange.map(xValue => itemAYRange.map(yValue => [xValue, yValue])).reduce((acc, x) => acc.concat(x), [])

  const tupleB = itemBXRange.map(xValue => itemBYRange.map(yValue => [xValue, yValue])).reduce((acc, x) => acc.concat(x), [])

  return tupleA.some(tuple => arrayIncludesArray(tuple, tupleB))
}

// console.log('SHOULD BE TRUE:', doesOverlap({ height: 1, width: 1, x: 0, y: 0 }, { height: 1, width: 1, x: 0, y: 0 }))
// console.log('SHOULD BE TRUE:', doesOverlap({ height: 10, width: 10, x: 0, y: 0 }, { height: 1, width: 1, x: 1, y: 1 }))
// console.log('SHOULD BE FALSE:', doesOverlap({ height: 1, width: 1, x: 0, y: 0 }, { height: 1, width: 1, x: 1, y: 1 }))

const availablePosition = (
  itemDimensions: { height: number; width: number },
  pane: { height: number; width: number },
  placedItems: { height: number; width: number; x: number; y: number }[] = []
): any => {
  // take into account the height and width of the item to place
  // take into account other items on the page (inc. button and any other non-pdf things)
  // take into account number of pdfs on each pane (4)
  // get random xy
  // check that no part of item would be at any part of any other item
  // return or recurse
  // if no available position?

  console.log('Getting available position')

  const position = { x: parseInt(String(Math.random() * pane.width), 10), y: parseInt(String(Math.random() * pane.height), 10) }

  return placedItems.some(item => doesOverlap({ ...itemDimensions, ...position }, item))
    ? availablePosition(itemDimensions, pane, placedItems)
    : { ...itemDimensions, ...position }
}

// console.log(
//   // { x: 943, y: 885 },
//   // [{ height: 100, width: 100, x: 889, y: 875 }, { height: 100, width: 100, x: 734, y: 714 }].some(item =>
//   //   doesOverlap({ height: 100, width: 100, x: 889, y: 875 }, item)
//   // ),
//   'CHECK TODAY',
//   doesOverlap({ height: 100, width: 100, x: 889, y: 875 }, { height: 100, width: 100, x: 889, y: 875 })
// )

const size = { height: 100, width: 100 }
const paneDimensions = { height: 1000, width: 1000 }

const positions = (count: number) => Array.from(Array(count)).reduce(acc => acc.concat(availablePosition(size, paneDimensions, acc)), [])

// console.log('positions', positions(4))

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
          {positions(4).map(
            ({ height, width, x, y }) => (
              // console.log(x, y) || (
              <div style={{ position: 'absolute', background: 'black', height, width, transform: `translate3d(${x}px, ${y}px, 0)` }} />
            )
            // )
          )}
        </LayoutMain>
      </LayoutRoot>
    )}
  />
)

export default IndexLayout
