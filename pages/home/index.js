import { useFrame, useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Button } from 'components/button'
import { Card } from 'components/card'
import { Title } from 'components/intro'
import { Link } from 'components/link'
import { ListItem } from 'components/list-item'
import { projects } from 'content/projects'
import { useScroll } from 'hooks/use-scroll'
import { Layout } from 'layouts/default'
import { button, useControls } from 'leva'
import { clamp, mapRange } from 'lib/maths'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useIntersection, useWindowSize } from 'react-use'
import s from './home.module.scss'
// import { Modal } from 'components/modal'

// const SFDR = dynamic(() => import('icons/sfdr.svg'), { ssr: false })
const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })
const Sponsor = dynamic(() => import('icons/linkedin.svg'), { ssr: false })

const Parallax = dynamic(
  () => import('components/parallax').then((mod) => mod.Parallax),
  { ssr: false }
)

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

const HorizontalSlides = dynamic(
  () =>
    import('components/horizontal-slides').then((mod) => mod.HorizontalSlides),
  { ssr: false }
)

const FeatureCards = dynamic(
  () => import('components/feature-cards').then((mod) => mod.FeatureCards),
  { ssr: false }
)

const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

const HeroTextIn = ({ children, introOut }) => {
  return (
    <div className={cn(s['hide-text'], introOut && s['show-text'])}>
      {children}
    </div>
  )
}

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
}

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState()
  const zoomRef = useRef(null)
  const [zoomWrapperRectRef, zoomWrapperRect] = useRect()
  const { height: windowHeight } = useWindowSize()
  const introOut = useStore(({ introOut }) => introOut)

  const [theme, setTheme] = useState('dark')
  const lenis = useStore(({ lenis }) => lenis)

  useControls(
    'lenis',
    () => ({
      stop: button(() => {
        lenis.stop()
      }),
      start: button(() => {
        lenis.start()
      }),
    }),
    [lenis]
  )

  useControls(
    'scrollTo',
    () => ({
      immediate: button(() => {
        lenis.scrollTo(30000, { immediate: true })
      }),
      smoothDuration: button(() => {
        lenis.scrollTo(30000, { lock: true, duration: 10 })
      }),
      smooth: button(() => {
        lenis.scrollTo(30000)
      }),
      forceScrollTo: button(() => {
        lenis.scrollTo(30000, { force: true })
      }),
    }),
    [lenis]
  )

  useEffect(() => {
    if (!lenis) return

    function onClassNameChange(lenis) {
      console.log(lenis.className)
    }

    lenis.on('className change', onClassNameChange)

    return () => {
      lenis.off('className change', onClassNameChange)
    }
  }, [lenis])

  useScroll(({ scroll }) => {
    setHasScrolled(scroll > 10)
    if (!zoomWrapperRect.top) return

    const start = zoomWrapperRect.top + windowHeight * 0.5
    const end = zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

    const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
    const center = 0.6
    const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1)
    const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1)
    setTheme(progress2 === 1 ? 'light' : 'dark')

    zoomRef.current.style.setProperty('--progress1', progress1)
    zoomRef.current.style.setProperty('--progress2', progress2)

    if (progress === 1) {
      zoomRef.current.style.setProperty('background-color', 'currentColor')
    } else {
      zoomRef.current.style.removeProperty('background-color')
    }
  })

  const [whyRectRef, whyRect] = useRect()
  const [cardsRectRef, cardsRect] = useRect()
  const [whiteRectRef, whiteRect] = useRect()
  const [featuresRectRef, featuresRect] = useRect()
  const [inuseRectRef, inuseRect] = useRect()

  const addThreshold = useStore(({ addThreshold }) => addThreshold)

  useEffect(() => {
    addThreshold({ id: 'top', value: 0 })
  }, [])

  useEffect(() => {
    const top = whyRect.top - windowHeight / 2
    addThreshold({ id: 'why-start', value: top })
    addThreshold({
      id: 'why-end',
      value: top + whyRect.height,
    })
  }, [whyRect])

  useEffect(() => {
    const top = cardsRect.top - windowHeight / 2
    addThreshold({ id: 'cards-start', value: top })
    addThreshold({ id: 'cards-end', value: top + cardsRect.height })
    addThreshold({
      id: 'red-end',
      value: top + cardsRect.height + windowHeight,
    })
  }, [cardsRect])

  useEffect(() => {
    const top = whiteRect.top - windowHeight
    addThreshold({ id: 'light-start', value: top })
  }, [whiteRect])

  useEffect(() => {
    const top = featuresRect.top
    addThreshold({ id: 'features', value: top })
  }, [featuresRect])

  useEffect(() => {
    const top = inuseRect.top
    addThreshold({ id: 'in-use', value: top })
  }, [inuseRect])

  useEffect(() => {
    const top = lenis?.limit
    addThreshold({ id: 'end', value: top })
  }, [lenis?.limit])

  useScroll((e) => {
    console.log(window.scrollY, e.scroll, e.isScrolling, e.velocity, e.isLocked)
  })

  useFrame(() => {
    console.log('frame', window.scrollY, lenis?.scroll, lenis?.isScrolling)
  }, 1)

  const inUseRef = useRef()

  const [visible, setIsVisible] = useState(false)
  const intersection = useIntersection(inUseRef, {
    threshold: 0.2,
  })
  useEffect(() => {
    if (intersection?.isIntersecting) {
      setIsVisible(true)
    }
  }, [intersection])

  return (
    <Layout
      theme={theme}
      seo={{
        title: 'Mahavishnu K',
        description:
          'My Portfolio',
      }}
      className={s.home}
    >
      <div className={s.canvas}>
        <WebGL />
      </div>

      {/* <Modal /> */}

      <section className={s.hero}>
        <div className="layout-grid-inner">
          <Title className={s.title} />
          {/* <SFDR className={cn(s.icon, introOut && s.show)} /> */}
          <span className={cn(s.sub)}>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('h3', s.subtitle)}>MERN Stack Developer | ML Enthusiast</h2>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('p-xs', s.tm)}>
                <span>©</span> {new Date().getFullYear()} Mahavishnu K
              </h2>
            </HeroTextIn>
          </span>
        </div>

        <div className={cn(s.bottom, 'layout-grid')}>
          <div
            className={cn(
              'hide-on-mobile',
              s['scroll-hint'],
              hasScrolled && s.hide,
              introOut && s.show
            )}
          >
            <div className={s.text}>
              <HeroTextIn introOut={introOut}>
                <p>Swipe</p>
              </HeroTextIn>
              <HeroTextIn introOut={introOut}>
                <p>Up Next</p>
              </HeroTextIn>
            </div>
          </div>
          <h1 className={cn(s.description, 'p-s')}>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Eat Sleep Binge Repeat</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Wandering Nowhere</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Engineering Nerd</p>
            </HeroTextIn>
          </h1>
          <Button
            className={cn(s.cta, s.documentation, introOut && s.in)}
            arrow
            icon={<GitHub />}
            href="https://github.com/Mahavishnu-K"
          >
            Project's Hub
          </Button>
          <Button
            className={cn(s.cta, s.sponsor, introOut && s.in)}
            arrow
            icon={<Sponsor />}
            href="https://www.linkedin.com/in/mahavishnu-k-1a293922b/"
          >
            Let's connect
          </Button>
        </div>
      </section>

      <section className={s.why} data-lenis-scroll-snap-align="start">
        <div className="layout-grid">
          <h2 className={cn(s.sticky, 'h2')}>
            <AppearTitle>About me</AppearTitle>
          </h2>
          <aside className={s.features} ref={whyRectRef}>
            <div className={s.feature}>
              <p className="p">
                Late-Night Owl, part-time motivated and full-time debugger. 
                I spend my days wrestling with Python, C++, and Java, and my nights dreaming about that one elusive bug I couldn’t squash.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Crafting Codes since printed "Hello World!"
              </h3>
              <p className="p">
                I craft web apps with React, Flask, and Node.js, Day and Night, 
                I'm adept at writing code and training models—basically, if it involves bringing machine learning to life, I'm your go-to. Just don't ask me to debug!
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Think and Thing
              </h3>
              <p className="p">
                I like to think of myself as a curious mind with a knack for turning weird ideas into working code (most of the time). 
                Outside of coding, 
                you’ll probably find me overthinking the next big idea or frantically Googling how to fix my last “brilliant” one.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <section className={s.rethink}>
        <div className={cn('layout-grid', s.pre)}>
          <div className={s.highlight} data-lenis-scroll-snap-align="start">
            <Parallax speed={-0.5}>
              <p className="h2">
                <AppearTitle>The Stacks I use and thrive on</AppearTitle>
              </p>
            </Parallax>
          </div>
          <div className={s.comparison}>
            <Parallax speed={0.5}>
              <p className="p">
                Not all the time but most of the time.
              </p>
            </Parallax>
          </div>
        </div>
        <div className={s.cards} ref={cardsRectRef}>
          <HorizontalSlides>
            <Card
              className={s.card}
              number="01"
              image="/python.png"
              imageAlt="python"
              width="230px"
              height="auto"
              text="Python"
            />
            <Card
              className={s.card}
              number="02"
              image="/c++.png"
              imageAlt="C++"
              width="330px"
              height="auto"
              text="C++"
            />
            <Card
              className={s.card}
              number="03"
              image="/java.png"
              imageAlt="java"
              width="290px"
              height="auto"
              text="Java"
            />
            <Card
              className={s.card}
              number="04"
              image="/javascript.png"
              imageAlt="Javascript"
              width="230px"
              height="auto"
              text="Javascript"
            />
            <Card
              className={s.card}
              number="05"
              image="/react.png"
              imageAlt="react js"
              width="230px"
              height="auto"
              text="React JS"
            />
            <Card
              className={s.card}
              number="06"
              image="/node.png"
              imageAlt="node js"
              text="Node Js"
            />
            <Card
              className={s.card}
              number="07"
              image="/express.png"
              imageAlt="express js"
              width="auto"
              height="90px"
              text="Express Js"
            />
            <Card
              className={s.card}
              number="08"
              image="/mongodb.png"
              imageAlt="mongo db"
              width="auto"
              height="255px"
              text="Mongo DB"
            />
          </HorizontalSlides>
        </div>
      </section>
      <section
        ref={(node) => {
          zoomWrapperRectRef(node)
          zoomRef.current = node
        }}
        className={s.solution}
      >
        <div className={s.inner}>
          <div className={s.zoom}>
            <h2 className={cn(s.first, 'h1 vh')}>
              so I built <br />
              <span className="contrast">pretty stuff</span>
            </h2>
            <h2 className={cn(s.enter, 'h3 vh')}>
              Enter <br /> only if you wish
            </h2>
            <h2 className={cn(s.second, 'h1 vh')}>As it should be</h2>
          </div>
        </div>
      </section>
      <section className={cn('theme-light', s.featuring)} ref={whiteRectRef}>
        <div className={s.inner}>
          <div className={cn('layout-block', s.intro)}>
            <p className="h3">
              <AppearTitle>
              Since you came this far, <br/>I have <span className="grey">no choice!{' '}</span>
              </AppearTitle>
            </p>
            <p><br/></p>
            <p className="p-sl">
              <Link
                className="contrast semi-bold"
                href="https://github.com/Mahavishnu-K"
              >
                contributing on projects,
              </Link>{' '}
              I’m the kind of person who dives into projects, makes them functional, 
              and even comes up with clever app logic on the fly and don’t worry, I’m pretty good at it (or so I keep telling myself).
            </p>
          </div>
        </div>
        <section ref={featuresRectRef}>
          <FeatureCards />
        </section>
      </section>
      <section
        ref={(node) => {
          inuseRectRef(node)
          inUseRef.current = node
        }}
        className={cn('theme-light', s['in-use'], visible && s.visible)}
      >
        <div className="layout-grid">
          <aside className={s.title}>
            <p className="h3">
              <AppearTitle>
                Catch up
                <br />
                <span className="grey">with me</span>
              </AppearTitle>
            </p>
          </aside>
          <ul className={s.list}>
            {projects.map(({ title, icon, href, text }, i) => (
              <li key={i}>
                <ListItem
                  title={title}
                  icon={icon}
                  href={href}
                  text={text}
                  index={i}
                  visible={visible}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      id: 'home',
    }, // will be passed to the page component as props
  }
}
