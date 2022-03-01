
import logic from '../../../logic/logic'

const USERS_BASE_QUERY = 'users';

const passwordChangeService = {
  /**
   * @returns {Promise}
   */

  updatePassword(userData) {
    const method = 'PATCH';
    const body = {
      user: {
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        current_password: userData.current_password
      }
    };

    return logic._call(`${USERS_BASE_QUERY}/update_password`, method, body);
  }
};

export default passwordChangeService