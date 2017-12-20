import createHistory from 'history/createHashHistory';
import MessageActions from '../actions/MessageActions'

const history = createHistory();

history.listen((location,action) => {
  
})

export default history;
