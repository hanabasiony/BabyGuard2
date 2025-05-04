import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'
import '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'flowbite/dist/flowbite.min'

render(<App />, document.getElementById('app'))
