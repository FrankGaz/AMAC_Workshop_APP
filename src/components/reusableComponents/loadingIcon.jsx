import React ,{ useState, useEffect } from 'react'

const LoadingIcon = ({ loading }) => {
  const [isLoading, setIsloading] = useState(true)
  useEffect(() => {
    setIsloading(loading)
  }, [loading])
  return (
    <div data-test-id='loadingIcon'> 
      {isLoading && <div className='center'>
        <i className='ace-icon fa fa-spinner fa-spin fa-2x'></i>
      </div>
      }
    </div>
  )
}
export default LoadingIcon
