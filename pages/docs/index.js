import { react } from 'react'
import s from './docs.module.scss'

export default function Docs() {

  return (
    <div className={s.page}>
      <div id="wrapper" className={s.wrapper}>
        <p id="content" className={s.content} ref={contentRef}>
          <h1>Documentation</h1>
          <p>Welcome to my portfolio's documentation page!</p>
          <ul>
            <li>📝 How this portfolio was built</li>
            <li>⚙️ Technologies used (React, Next.js, Tailwind, etc.)</li>
            <li>📂 File structure and organization</li>
            <li>🚀 Deployment and hosting details</li>
            <li>💡 Tips and custom components overview</li>
          </ul>
          <p>More coming soon!</p>
        </p>
      </div>
    </div>
  )
}
