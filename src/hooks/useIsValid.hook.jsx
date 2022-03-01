import { useState, useEffect } from 'react'

const useIsValid = () => {

  const [isValid, setIsValid] = useState([])

  const handleIsValid = (name, flag) => {

    const arr = []
    // find if name is in isValid array
    const hay = isValid.find(i => i.name === name)
    // if is in the array change flag value
    if (hay) {
      isValid.forEach(i => {
        if (i.name === name) {
          i.flag = flag
        }
      })
    } else {
      // if not in array add it
      arr.push({ name, flag })
    }
    // update isValid array
    setIsValid(prev => ([...prev, ...arr]))
  }

  const activateActionButton = () => {
    const valid = !isValid.some(i => i.flag === false)
    return valid
  }

  return {
    handleIsValid,
    activateActionButton
  }
}

export default useIsValid