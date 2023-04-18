import React, { useState, useCallback } from 'react'

import DropZone from './DropZone'
import TrashDropZone from './TrashDropZone'
import SideBarItem from './SideBarItem'
import Row from './Row'
import initialData from './initial-data'
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from './helpers'

import { SIDEBAR_ITEMS, SIDEBAR_ITEM, COMPONENT, COLUMN } from './constants'
import shortid from 'shortid'

const Container = () => {
  const initialLayout = initialData.layout
  const initialComponents = initialData.components
  const [layout, setLayout] = useState(initialLayout)
  const [components, setComponents] = useState(initialComponents)

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split('-')
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath))
    },
    [layout]
  )

  /*
    interface handleDrop {
      dropZone: {
        path: string; // eg: '0-1-1'
        childrenCount: number
      },
      item: {
        type: string; // eg: 'component', 'row', 'column'
        id: string; // eg: 'component0' is an unique id
        path: string; // eg: '0-0-0'
      }
    }
  */
  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split('-') // array of string
      const pathToDropZone = splitDropZonePath.slice(0, -1).join('-') // string eg: '0-1'

      const newItem = { id: item.id, type: item.type }
      if (item.type === COLUMN) {
        newItem.children = item.children
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          id: shortid.generate(),
          ...item.component,
        }
        const newItem = {
          id: newComponent.id,
          type: COMPONENT,
        }
        setComponents({
          ...components,
          [newComponent.id]: newComponent,
        })
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        )
        return
      }

      // move down here since sidebar items don't have path
      const splitItemPath = item.path.split('-')
      const pathToItem = splitItemPath.slice(0, -1).join('-')

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          )
          return
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        )
        return
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      )
    },
    [layout, components]
  )

  /*
    interface renderRow {
      row: Row,
      currentPath: string
    }
  */
  const renderRow = (row, currentPath) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
      />
    )
  }

  // don't use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className='flex w-full h-screen'>
      <div className='w-[400px] bg-gray-100 overflow-hidden border-r p-3'>
        <div className='grid grid-cols-1 gap-2 items-start h-min'>
          {Object.values(SIDEBAR_ITEMS).map((sideBarItem, index) => (
            <SideBarItem key={sideBarItem.id} data={sideBarItem} />
          ))}
        </div>
      </div>
      <div className='w-full overflow-y-auto p-5 border'>
        <div className='page'>
          <div className='flex flex-wrap items-start'>
            {layout.map((row, index) => {
              // currentPath is string
              const currentPath = `${index}`

              return (
                <React.Fragment key={row.id}>
                  <DropZone
                    data={{
                      path: currentPath,
                      childrenCount: layout.length,
                    }}
                    onDrop={handleDrop}
                    path={currentPath}
                  />
                  {renderRow(row, currentPath)}
                </React.Fragment>
              )
            })}

            <DropZone
              data={{
                path: `${layout.length}`,
                childrenCount: layout.length,
              }}
              onDrop={handleDrop}
              isLast
            />
          </div>
        </div>

        <TrashDropZone
          data={{
            layout,
          }}
          onDrop={handleDropToTrashBin}
        />
      </div>
    </div>
  )
}
export default Container
