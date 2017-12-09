import dispatcher from '../dispatcher';
import constants from '../constants/constants';

export default{
  displayErrors: (err) => {
    dispatcher.dispatch({
      type: constants.BAD_AUTH,
      errors:{
        summary: err.message,
        errors: err.errors
      }
    })
  },
  displayMessage: (message) => {
    console.log(message)
    dispatcher.dispatch({
      type: "SUCCESS",
      summary: message
    })
  }
}
