import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';

export default class BaseStore extends EventEmitter{
  subscribe(actionSubscribe){
    this._dispatchToken = dispatcher.register(actionSubscribe());
  }

  get dispatchToken(){
    return this._dispatchToken;
  }

  emitChange(){
    this.emit('change');
  }

  addChangeListener(cb){
    this.on('change',cb)
  }
  removeChangeListener(cb){
    this.removeListener('change',cb);
  }
}
