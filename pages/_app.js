import Tempus from '@darkroom.engineering/tempus'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useScroll } from 'hooks/use-scroll'
import { GTM_ID } from 'lib/analytics'
import { useStore } from 'lib/store'
import Script from 'next/script'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/next';
import 'styles/global.scss'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  // ScrollTrigger.defaults({ markers: process.env.NODE_ENV === 'development' })

  // merge rafs
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)
  Tempus.add((time) => {
    gsap.updateRoot(time / 1000)
  }, 0)
}

function MyApp({ Component, pageProps }) {
  const lenis = useStore(({ lenis }) => lenis)

  useScroll(ScrollTrigger.update)

  useEffect(() => {
    if (lenis) {
      ScrollTrigger.refresh()
      lenis?.start()
    }
  }, [lenis])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  return (
    <>
      {/* Google Tag Manager - Global base code */}
        <>
          <Script
            async
            strategy="worker"
            src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
          />
          <Script
            id="gtm-base"
            strategy="worker"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GTM_ID}');`,
            }}
          />
        </>

      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default MyApp