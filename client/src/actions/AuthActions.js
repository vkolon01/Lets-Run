import dispatcher from '../dispatcher';

export default {
  loginUser: (jwt) => {
    //var existingJwt = localStorage.getItem('jwt');
    dispatcher.dispatch({
      type: "LOGIN_USER",
      jwt: jwt
    });
  },
  logoutUser: () => {
    localStorage.removeItem('jwt');
    dispatcher.dispatch({
      type: "LOGOUT_USER"
    })
  },
  displayErrors: (err) => {
    dispatcher.dispatch({
      type: "BAD_AUTH",
      errors: err
    })
  }
}
