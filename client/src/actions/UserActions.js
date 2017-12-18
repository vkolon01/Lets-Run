import dispatcher from '../dispatcher';

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
