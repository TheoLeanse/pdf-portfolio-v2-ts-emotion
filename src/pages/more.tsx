import * as React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import LayoutRoot from '../components/LayoutRoot'
import Helmet from 'react-helmet'
import LayoutMain from '../components/LayoutMain'
import { FixedRedButton } from '../layouts'
import styled from '@emotion/styled'
import watch from '../watch.svg'

type StaticQueryProps = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
}

const AboutContainer = styled.div`
  background-image: url(${watch});
  background-position: center;
  background-repeat: no-repeat;
  background-color: black;
  background-size: 50vh;
  color: white;
  height: 100vh;
`

const AboutInner = styled.div`
  margin: 0 auto;
  max-width: 300px;
  padding-top: 20vh;
`

const About: React.SFC = () => (
  <AboutContainer>
    <AboutInner>
      <p>T J Watson is an artist.</p>
      <p>Working in London and elsewhere.</p>
      <p>tjw [at] tjwatson.co.uk</p>
    </AboutInner>
  </AboutContainer>
)

const PageTwo: React.SFC = () => (
  <StaticQuery
    query={graphql`
      query MoreLayoutQuery {
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
          <About />
          <Link to="/">
            <FixedRedButton>Back</FixedRedButton>
          </Link>
        </LayoutMain>
      </LayoutRoot>
    )}
  />
)

export default PageTwo
