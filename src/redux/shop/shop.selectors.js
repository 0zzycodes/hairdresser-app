import { createSelector } from 'reselect';

const selectShop = state => state.shop;

export const selectShops = createSelector([selectShop], shop => shop.shops);
