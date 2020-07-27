import AsyncStorage from '@react-native-community/async-storage';

import {showToast} from '../utils/toast-android';

// agregar producto al carrito de compras
export async function addToCart(product, shop) {

  const cart = await AsyncStorage.getItem('cart-shop');

  // validar si el carrito esta con productos
  let _products = [];
  if (cart !== null) {
    _products = JSON.parse(cart);
  }

  // validar si ya existe solo se aumenta la cantidad
  let exist = false;
  _products.map((p, index) => {
    if (p._id === product._id) {
      _products[index].cant_shop += 1;
      // calcular total
      _products[index].total = parseFloat(
        _products[index].cant_shop * parseFloat(_products[index].price),
      );
      exist = true;
    }
  });

  // agregar si no existe con cntidad en 1
  if (!exist) {
    product.shop = shop;
    product.cant_shop = 1;
    product.total = product.price;
    _products.push(product);
  }

  showToast('Producto agregado');

  // actualizar storage
  await AsyncStorage.setItem('cart-shop', JSON.stringify(_products));
}
