import React from 'react'
import ReactDOM from 'react-dom/client'
import Example from './example'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import './index.css'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <div className='App'>
    <DndProvider backend={Backend}>
      <Example />
    </DndProvider>
  </div>
)
