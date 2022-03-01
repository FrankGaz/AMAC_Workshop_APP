// SERVICE THAT CONFIGURES THE API CALLS TO MAIN LOGIC FILE
import logic from '../../../logic/logic'

const securityService = {

    updatePassword(passwordData) {

        const user = JSON.parse(logic._userId)
        const userId = user.id
       
        const method = "PATCH";
        const body = {
          user: {
            password: passwordData.new_password,
            password_confirmation: passwordData.new_password
          }
        };
        return logic._call(`users/${userId}`, method, body);  
      },
}

export default securityService