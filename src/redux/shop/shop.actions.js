import { ShopActionTypes } from './shop.types';

export const setShops = shops => ({
  type: ShopActionTypes.SET_SHOPS,
  payload: shops
});
