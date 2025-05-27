import cn from 'clsx'
import s from './card.module.scss'
import dynamic from 'next/dynamic'
import { useStore } from 'lib/store'
import { Button } from 'components/button'
import FuzzyText from 'components/fuzzy-text'

export const Card = ({
  number,
  text,
  className,
  inverted,
  background = 'rgba(14, 14, 14, 0.15)',
  image,
  width,
  height,
  end,
  projectLink,
  imageAlt = '',
}) => {
  const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })
  const introOut = useStore(({ introOut }) => introOut)
  
  return (
    <div
      className={cn(className, s.wrapper, inverted && s.inverted, image && s.hasImage, projectLink && s.hasLink)}
      style={{ '--background': background }}
    >
      {end ? (
        <div className={s.endText}>
          <FuzzyText 
            baseIntensity={0.2} 
            hoverIntensity={0.5} 
            enableHover={true}
            fontSize="4rem"
          >
            on progress...
          </FuzzyText>
        </div>
      ) : (
        <>
            {/* Number at the top */}
            {number && (
              <p className={s.number}>{number.toString().padStart(2, '0')}</p>
            )}
            
            {/* Image in the middle */}
            {image && (
              <div className={s.imageContainer}>
                <img src={image} alt={imageAlt} className={s.image} width={width} height={height}/>
              </div>
            )}

            {/* Text at the bottom */}
            {text && <p className={s.text}>{text}</p>}

            {projectLink && (
              <div>
                <Button
                  className={cn(introOut && s.in)}
                  arrow
                  icon={<GitHub />}
                  href={projectLink}
                >
                  More about this
                </Button>
              </div>
            )}
        </>
      )}
    </div>
  )
}