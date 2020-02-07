import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import shopReducer from './shop/shop.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['shop']
};

const rootReducer = combineReducers({
  user: userReducer,
  shop: shopReducer
});

export default persistReducer(persistConfig, rootReducer);
