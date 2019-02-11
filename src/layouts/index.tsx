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

import { isOdd, positions } from '../utils'

type StaticQueryProps = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
}

const size = { height: 200, width: 175 }
const paneDimensions = { height: 750, width: 1100 }

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

const PdfsInSections = () => {
  const visible = useVisibilityDelay(750)
  const pdfs = useSetOnMount([], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18])
  return chunk(4, pdfs).map((pdfChunk, i) => (
    <Section odd={isOdd(i)} key={pdfChunk[0]}>
      {positions(pdfChunk.length, size, paneDimensions).map((shape: Shape) => (
        <Container key={`${shape.x}-${shape.y}`} {...shape} fullWidth={paneDimensions.width} visible={visible} />
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
