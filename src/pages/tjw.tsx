import * as React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import LayoutRoot from '../components/LayoutRoot'
import Helmet from 'react-helmet'
import LayoutMain from '../components/LayoutMain'
import { FixedRedButton, getWindowWidth } from '../layouts'
import styled from '@emotion/styled'
import css from '@emotion/css'
import watch from '../watch.svg'
import { withPositions } from '../utils'
import { fadeIn } from '../components/Container'
import marked from 'marked'

type StaticQueryProps = {
  site: {
    siteMetadata: {
      title: string
      description: string
    }
  }
  siteDescription: {
    frontmatter: { sideDescription: string }
  }
  aboutMeItems: {
    frontmatter: { aboutMeItems: string }
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

const AboutBackground = styled.div`
  background-image: url(${watch});
  background-position: center;
  background-repeat: no-repeat;
  background-color: black;
  background-size: 50vh;
  height: 100vh;
`

const paneHeight = 750

const dynamicStyle = ({ x, y }: { x: number; y: number }) => css`
  top: ${y}px;
  left: ${x}px;
  animation: ${fadeIn} 0.75s ease-in;
`

const TextBox = styled.div`
  ${dynamicStyle};
  position: absolute;
  color: white;
  border: white solid 1px;
  padding: 5px;
  background: black;
`

const TextboxesInPosition = ({ texts }) => {
  const paneWidth = getWindowWidth()
  const height = paneWidth > 500 ? paneHeight : paneHeight * 1.5
  const textsWithPositions = withPositions(texts, { height: 200, width: 100 }, { height, width: paneWidth })
  return (
    <div>
      {textsWithPositions.map(textWithPosition => (
        <TextBox
          key={`${textWithPosition.x}-${textWithPosition.y}`}
          x={textWithPosition.x}
          y={textWithPosition.y}
          dangerouslySetInnerHTML={{ __html: marked(textWithPosition.content) }}
        />
      ))}
    </div>
  )
}

const PageTwo: React.SFC = () => (
  <StaticQuery
    query={graphql`
      query MoreLayoutQuery {
        site {
          siteMetadata {
            title
          }
        }
        aboutMeItems: markdownRemark(fileAbsolutePath: { regex: "/about-me-items/" }) {
          frontmatter {
            aboutMeItems {
              content
            }
          }
        }
        siteDescription: markdownRemark(fileAbsolutePath: { regex: "/site-description/" }) {
          frontmatter {
            sideDescription
          }
        }
      }
    `}
    render={(data: StaticQueryProps) => {
      return (
        <LayoutRoot>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: data.siteDescription.frontmatter.sideDescription },
              { name: 'keywords', content: 'gatsbyjs, gatsby, javascript, sample, something' }
            ]}
          />
          <LayoutMain>
            <AboutBackground />
            <TextboxesInPosition texts={data.aboutMeItems.frontmatter.aboutMeItems} />
            <Link to="/">
              <FixedRedButton>Work</FixedRedButton>
            </Link>
          </LayoutMain>
        </LayoutRoot>
      )
    }}
  />
)

export default PageTwo
