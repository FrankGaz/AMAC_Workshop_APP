const utils = {
    // Function that capitalizes the first letter in a word, needed when manipulating itemType to dynamically load the getFunctions
    capitalize(word) {
        return word && word[0].toUpperCase() + word.slice(1)
    },

    // The variable that I want to dynamically access is given to me in the form of string, which means that obj[property] does not work (as obj is a given to me as a string). 
    // A solution to this is to use the function below
    unstringItem(obj) {
        return Function(`return ${obj}`)()
    },

   // checks whether an object is empty
    isEmpty(obj) { 
        for ( var prop in obj ) { 
          return false; 
        } 
        return true; 
      }
}
export default utils