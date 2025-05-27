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

const cards = [
  { text: 'Fingerprint Based Voting system', link: "https://github.com/Mahavishnu-K/Fingerprint-voting" },

  { text: 'Eye Disease Detection trough CNN', link: "https://github.com/Mahavishnu-K/Eye-Disease-Detection-ML" },
  { text: 'CamSoori tea shop', link: "https://github.com/Mahavishnu-K/Tea-Shop-Web"  },
  { text: 'Skill-sync Coding Learner Platform with AI Capabilities', link: "https://github.com/Mahavishnu-K/Skill-Sync"},
  { text: 'Assessly A fully Operative Test Conducting Tool', link: "https://github.com/Mahavishnu-K/Assessly"},
  { end: 'true' },
]

export const FeatureCards = () => {
  const element = useRef()
  const [setRef, rect] = useRect()
  const { height: windowHeight } = useWindowSize()

  const [current, setCurrent] = useState()

  useScroll(
    ({ scroll }) => {
      const start = rect.top - windowHeight * 0.6
      const end = rect.top + rect.height - 0.7

      const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
      

      element.current.style.setProperty(
        '--progress',
        clamp(0, mapRange(rect.top, end, scroll, 0, 1), 1)
      )
      const step = Math.floor(progress * 8)
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
              projectLink={card.link}
              current={index <= current - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const SingleCard = ({ text, number, projectLink, index, current, end }) => {
  return (
    <div className={cn(s.card, current && s.current)} style={{ '--i': index }}>
      <Card background="rgba(239, 239, 239, 0.8)" number={number} text={text} end={end} projectLink={projectLink} />
    </div>
  )
}
