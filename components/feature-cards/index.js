import { useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Card } from 'components/card'
import { useScroll } from 'hooks/use-scroll'
import { clamp, mapRange } from 'lib/maths'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { useWindowSize } from 'react-use'

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

import s from './feature-cards.module.scss'

const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })
const WebSite = dynamic(() => import('icons/website.svg'), { ssr: false })

const cards = [
  { text: 'Fingerprint Based Voting system', link: "https://github.com/Mahavishnu-K/Fingerprint-voting", buttonText: "More about this", icon: <GitHub /> },
  { text: 'Eye Disease Detection trough CNN', link: "https://github.com/Mahavishnu-K/Eye-Disease-Detection-ML", buttonText: "More about this", icon: <GitHub /> },
  { text: 'CamSoori tea shop', link: "https://github.com/Mahavishnu-K/Tea-Shop-Web", buttonText: "More about this", icon: <GitHub />  },
  { text: 'Skill-sync Coding and skill development platform', link: "https://skillsync.weacttech.com ", buttonText: "Live app", icon: <WebSite />},
  { text: 'Assessly A fully Operative Test Conducting Tool', link: "https://assessly.weacttech.com", buttonText: "Live app", icon: <WebSite />},
  { text: 'a1 call taxi hosur', link: "https://a1calltaxihosur.com", buttonText: "Live app", icon: <WebSite />},
  { text: 'FastDB The AI powered Cloud Database with NL query support', link: "https://fast-db-landing.vercel.app", buttonText: "Landing site", icon: <WebSite />},
  { end: 'true' },
]

export const FeatureCards = () => {
  const element = useRef()
  const [setRef, rect] = useRect()
  const { height: windowHeight } = useWindowSize()

  const [current, setCurrent] = useState()

  useScroll(
    ({ scroll }) => {
      const start = rect.top - windowHeight * 0.7
      const end = rect.top + rect.height - 0.9

      const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
      

      element.current.style.setProperty(
        '--progress',
        clamp(0, mapRange(rect.top, end, scroll, 0, 1), 1)
      )
      const step = Math.floor(progress * 11)
      setCurrent(step)
    },
    [rect]
  )

  return (
    <div
      ref={(node) => {
        setRef(node)
      }}
      className={s.features}
    >
      <div className={cn('layout-block-inner', s.sticky)}>
        <aside className={s.title}>
          <p className="h3">
            <AppearTitle>
              Projects Brings 
              <br />
              <span className="grey">the heat</span>
            </AppearTitle>
          </p>
        </aside>
        <div ref={element}>
          {cards.map((card, index) => (
            <SingleCard
              key={index}
              index={index}
              text={card.text}
              number={index + 1}
              end={card.end}
              buttonText={card.buttonText}
              projectLink={card.link}
              icon={card.icon}
              current={index <= current - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const SingleCard = ({ text, number, projectLink, index, buttonText, icon, current, end }) => {
  return (
    <div className={cn(s.card, current && s.current)} style={{ '--i': index }}>
      <Card background="rgba(239, 239, 239, 0.8)" number={number} text={text} buttonText={buttonText} icon={icon} end={end} projectLink={projectLink} />
    </div>
  )
}
