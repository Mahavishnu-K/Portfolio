import cn from 'clsx'
import { Link } from 'components/link'
import dynamic from 'next/dynamic'
import s from './list-item.module.scss'

const Arrow = dynamic(() => import('icons/arrow-diagonal.svg'), { ssr: false })

export const ListItem = ({
  className,
  title,
  icon,
  href,
  text,
  visible,
  index,
}) => {
  return (
    <Link
      href={href}
      className={cn(className, s.item, visible && s.visible)}
      style={{ '--i': index }}
    >
      <div className={s.inner}>
        <div className={s.title}>
          <span className={s.text}>{title}</span>
          <Arrow className={s.arrow} />
        </div>
        {icon ? (
            <div className={s.source}>
              <img src={icon} alt={icon}/>
            </div>
        ) : (
          <div className={s.text}>
            <h3>{text}</h3>
          </div>
        )}
      </div>
    </Link>
  )
}
