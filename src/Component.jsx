import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'
import { COMPONENT } from './constants'

const Component = ({ data, components, path }) => {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    item: { type: COMPONENT, id: data.id, path },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(ref)

  const component = components[data.id]

  return (
    <div ref={ref} className='px-3 py-2'>
      <div>
        {component.type === 'name' ? (
          <input
            placeholder='John doe'
            className='border-2 border-indigo-500 outline-none rounded-lg px-3 py-2'
          />
        ) : (
          false
        )}

        {component.type === 'paragraph' ? (
          <p className='w-72 text-justify'>
            The HyperText Markup Language or HTML is the standard markup
            language for documents designed to be displayed in a web browser. It
            is often assisted by technologies such as Cascading Style Sheets
            (CSS) and scripting languages such as JavaScript.
          </p>
        ) : (
          false
        )}

        {component.type === 'email' ? (
          <input
            placeholder='johndoe@gmail.com'
            className='border-2 border-indigo-500 outline-none rounded-lg px-3 py-2'
          />
        ) : (
          false
        )}

        {component.type === 'phone' ? (
          <input
            placeholder='018XXXXXXXX'
            className='border-2 border-indigo-500 outline-none rounded-lg px-3 py-2'
          />
        ) : (
          false
        )}

        {component.type === 'image' ? (
          <img
            src='https://unsplash.com/photos/JQMe7s6GnuI/download?ixid=MnwxMjA3fDB8MXxhbGx8MjR8fHx8fHwyfHwxNjgxNzkyMjI2&force=true&w=240'
            className='w-72'
          />
        ) : (
          false
        )}
      </div>
    </div>
  )
}
export default Component
