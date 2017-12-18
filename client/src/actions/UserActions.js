import dispatcher from '../dispatcher';
import constants from '../constants/constants';

export default{
  fetchUser: (user_id) => {
    dispatcher.dispatch({
      type: "FETCH_USER",
      user_id
    })
  },
  receiveUser: (user) => {
    dispatcher.dispatch({
      type: "RECEIVE_USER",
      user
    })
  }
}
