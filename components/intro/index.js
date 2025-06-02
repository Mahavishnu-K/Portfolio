import { useMediaQuery } from '@darkroom.engineering/hamo'
import cn from 'clsx'
import { useStore } from 'lib/store'
import { useEffect, useState } from 'react'
import s from './intro.module.scss'

export const Intro = () => {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [isLoaded, setIsLoaded] = useState(false)
  const [scroll, setScroll] = useState(false)
  const introOut = useStore(({ introOut }) => introOut)
  const setIntroOut = useStore(({ setIntroOut }) => setIntroOut)
  const lenis = useStore(({ lenis }) => lenis)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
  }, [])

  useEffect(() => {
    if (isMobile) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
      return
    }

    if (!scroll) {
      document.documentElement.classList.toggle('intro', true)
    }

    if (!lenis) return
    if (scroll) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
    } else {
      setTimeout(() => {
        lenis.stop()
      }, 0)

      document.documentElement.classList.toggle('intro', true)
    }
  }, [scroll, lenis, isMobile])

  return (
    <div
      className={cn(s.wrapper, isLoaded && s.out)}
      onTransitionEnd={(e) => {
        e.target.classList.forEach((value) => {
          if (value.includes('out')) {
            setScroll(true)
          }
          if (value.includes('show')) {
            setIntroOut(true)
          }
        })
      }}
    >
      <div className={cn(isLoaded && s.relative)}>
        <VishnuAnimation isLoaded={isLoaded} introOut={introOut} fill={'var(--black)'} />
      </div>
    </div>
  )
}

export const Title = ({ className }) => {
  const introOut = useStore(({ introOut }) => introOut)

  return (
    <div className={className}>
      <VishnuAnimation introOut={introOut} fill={'var(--pink)'} isAnimationComplete={true} />
    </div>
  )
}

const VishnuAnimation = ({ isLoaded, introOut, fill, isAnimationComplete = false }) => {
  return (
    <div className={s.vishnuWrapper}>
      <div className={cn(s.topRow, introOut && s.mergeAnimation)}>
        <h1 style={{ color: fill }}>
          <span className={cn(s.start, s.letter, (isLoaded || isAnimationComplete) && s.show, introOut && s.mergeV)} style={{ '--index': 0, padding: '60px 0px 60px 0px' }}>V</span>
          <span className={cn(s.spacer, introOut && s.hide)}></span>
          <span className={cn(s.start, s.letter, (isLoaded || isAnimationComplete) && s.show, introOut && s.mergeI)} style={{ '--index': 6, padding: '60px 0px 60px 0px' }}>I</span>
          <span className={cn(s.spacer, introOut && s.hide)}></span>
          <span className={cn(s.start, s.letter, (isLoaded || isAnimationComplete) && s.show, introOut && s.mergeS)} style={{ '--index': 0, padding: '60px 0px 60px 0px' }}>S</span>
          <span className={cn(s.spacer, introOut && s.hide)}></span>
          <span className={cn(s.start, s.letter, (isLoaded || isAnimationComplete) && s.show, introOut && s.mergeH)} style={{ '--index': 6, padding: '60px 0px 60px 0px' }}>H</span>
          <span className={cn(s.spacer, introOut && s.hide)}></span>
          <span className={cn(s.start, s.letter, s.letterN, (isLoaded || isAnimationComplete) && s.show, introOut && s.mergeN)} style={{ '--index': 0, padding: '60px 0px 60px 0px' }}>N</span>
          <span className={cn(s.spacer, introOut && s.hide)}></span>
          <span className={cn(s.start, s.letter, s.letterU, (isLoaded || isAnimationComplete) && s.show, introOut && s.mergeU)} style={{ '--index': 6, padding: '60px 0px 60px 0px' }}>U</span>
        </h1>
      </div>
    </div>
  )
}