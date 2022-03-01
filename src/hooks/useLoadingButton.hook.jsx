import { useState } from 'react'

const useLoadingButton = (initialState) => {  
  const [loading, setLoading] = useState(initialState || false)
  const setLoadingValue = boolean =>{ 
    setLoading(boolean)
  }
 
  return {
   loading,
   setLoadingValue
  }
}

export default useLoadingButton