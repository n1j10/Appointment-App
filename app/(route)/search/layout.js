import React from 'react'
import CategoryList from './_components/CategoryList'
function layout({children,params}) {
  return (
    <div className='grid grid-cols-5'>

    <div className=' hidden md:block '>
      {/*category*/}

      <CategoryList/>
    </div>


    <div className='col-span-3'>{children}</div>

    </div>
  )
}

export default layout