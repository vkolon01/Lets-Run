import createHistory from 'history/createHashHistory';

const history = createHistory();

history.listen((location,action) => {

})

export default history;
