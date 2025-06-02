import cn from 'clsx'
import { Button } from 'components/button'
import { Link } from 'components/link'
import dynamic from 'next/dynamic'
import s from './footer.module.scss'

const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })

export const Footer = () => {
  return (
    <footer className={cn('theme-light', s.footer)}>
      <div className={cn(s.top, 'layout-grid hide-on-mobile')}>
        <p className={cn(s['first-line'], 'h1')}>
          can't find a<br/>
          <span className="contrast">Nerd like me?</span>
        </p>
        {/* <div className={s['shameless-plug']}>
          <p className="h4">Studio Freight</p>
          <p className="p-s">
            An independent creative <br /> studio built on principle
          </p>
        </div> */}
        <p className={cn(s['last-line'], 'h1')}>
          & drop a <span className="hide-on-desktop">&nbsp;</span> ping{' '}
          <br /> and team up!
        </p>
        <Button
          className={s.cta}
          arrow
          icon={<GitHub />}
          href="https://github.com/Mahavishnu-K"
        >
          Let's build together
        </Button>
      </div>
      <div className={cn(s.top, 'layout-block hide-on-desktop')}>
        {/* <div className={s['shameless-plug']}>
          <p className="h4">Studio Freight</p>
          <p className="p-s">
            An independent creative <br /> studio built on principle
          </p>
        </div> */}
        <p className={cn(s['first-line'], 'h1')}>
          can't find a <br />
          <span className="contrast">Nerd like me?</span>
          <br /> & drop a <br /> ping and team up!
        </p>  
      </div>
      <div className={s.bottom}>
        <div className={s.links}>
          <Link
            className={cn(s.link, 'p-xs')}
            href="https://leetcode.com/u/MAHAVISHNU_K/"
          >
            Leetcode
          </Link>
          <Link
            className={cn(s.link, 'p-xs')}
            href="https://github.com/Mahavishnu-K"
          >
            GitHub
          </Link>
          <Link
            className={cn(s.link, 'p-xs')}
            href="https://mahavishnu.io/"
          >
            Website
          </Link>
          <Link className={cn(s.link, 'p-xs')} href="https://weacttech.com">
            Powered by junks
          </Link>
        </div>
        <p className={cn('p-xs', s.tm)}>
          <span>©</span> {new Date().getFullYear()} Mahavishnu K
        </p>
        <Button
          className={cn(s.cta, 'hide-on-desktop')}
          arrow
          icon={<GitHub />}
          href="https://github.com/Mahavishnu-K"
        >
          Let's build together
        </Button>
      </div>
    </footer>
  )
}
