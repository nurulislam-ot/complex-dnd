import classNames from 'classnames'
import React from 'react'
import { useDrag } from 'react-dnd'

/*
  interface Props {
    data: {
      id: string;
      type: string;
      component: {
          type: string;
          content: string;
      }
    }
  }
*/

const SideBarItem = ({ data }) => {
  const [{ isDragging }, drag] = useDrag({
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      className={classNames(
        'w-full border bg-white px-4 py-3 rounded-lg cursor-pointer',
        {
          'opacity-50 cursor-move': isDragging,
        }
      )}
      ref={drag}
    >
      <p className='text-lg font-semibold'>{data.component.type}</p>
      <p className='text-gray-600'>Lorem ipsum, dolor sit</p>
    </div>
  )
}
export default SideBarItem
