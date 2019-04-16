import React, { useState, useEffect } from 'react'
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
import Container from '../components/Container'

import { isOdd, withPositions } from '../utils'
import css from '@emotion/css'

type StaticQueryProps = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: {
          file: string
          thumbnail: string
        }
      }
    }
  }
}

// A4: 210 × 297
const getA4 = (height: number) => ({ height, width: height / (297 / 210) })
const size = getA4(200)
const paneHeight = 750

const useVisibilityDelay = (delay: number) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timeout)
  }, [])
  return visible
}

const useSetOnMount: <T>(initial: T, mounted: T) => T = (initial, mounted) => {
  const [value, setValue] = useState(initial)
  useEffect(() => {
    setValue(mounted)
  }, [])
  return value
}

interface PdfsInSectionsProps {
  pdfs: {
    file: string
    thumbnail: string
  }[]
}

export const getWindowWidth = () => {
  let width: number
  try {
    width = window.innerWidth
  } catch (e) {
    width = 0
  }
  return width
}

// TODO: enable editng via CMS
const PDFS_PER_SECTION = 5

const PdfsInSections: React.FunctionComponent<PdfsInSectionsProps> = props => {
  const visible = useVisibilityDelay(750)
  const pdfs = useSetOnMount([], props.pdfs)
  const width = getWindowWidth()
  return (
    <>
      {chunk(PDFS_PER_SECTION, pdfs).map((pdfChunk, i) => (
        <Section odd={isOdd(i)} key={pdfChunk[0].file} width={width} height={width > 500 ? paneHeight : paneHeight * 1.5}>
          {withPositions(pdfChunk, size, { width, height: width > 500 ? paneHeight : paneHeight * 1.5 }).map(shape => (
            <a href={shape.file} key={`${shape.x}-${shape.y}`} target="_blank">
              <Container {...shape} fullWidth={width} visible={visible} />
            </a>
          ))}
        </Section>
      ))}
    </>
  )
}

const dynamicStyle = ({ height, width }: { height: number; width: number }) => css`
  height: ${height}px;
  width: ${width}px;
`

const ClubBackground = styled.div`
  ${dynamicStyle};
  position: relative;
  background-image: url(${workersClub});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 66%;
`
const ShipBackground = styled.div`
  ${dynamicStyle};
  position: relative;
  background-image: url(${containerShip});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 66%;
`

const Section: React.FunctionComponent<{ odd: boolean; height: number; width: number }> = ({ odd, children, height, width }) =>
  odd ? (
    <ClubBackground width={width} height={height}>
      {children}
    </ClubBackground>
  ) : (
    <ShipBackground width={width} height={height}>
      {children}
    </ShipBackground>
  )

// pause before rendering pdfs - use suspense with a timeout resource to have them all appear at the same time?

export const FixedRedButton = styled.button`
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
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                file
                thumbnail
              }
            }
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
          <PdfsInSections pdfs={data.allMarkdownRemark.edges.map(({ node }) => node.frontmatter)} />
          <Link to="/more">
            <FixedRedButton>T J Watson</FixedRedButton>
          </Link>
        </LayoutMain>
      </LayoutRoot>
    )}
  />
)

export default IndexLayout
