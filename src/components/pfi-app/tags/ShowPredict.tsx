import React from 'react'

const ShowPredict = ({ selectedKeys }: { selectedKeys: any }) => {
  return (
    <div className="bg-white rounded-3xl p-3 sm:p-5 mx-2 sm:mx-4 border border-gray-200 shadow-xl col-span-1 md:col-span-2">
      {selectedKeys}
    </div>
  )
}

export default ShowPredict