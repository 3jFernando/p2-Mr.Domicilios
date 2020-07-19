import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  SectionList,
} from 'react-native';
import TabsComponent from './TabsComponent';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FORMAT_CURRENCEY from '../utils/format_cash';

export default function CartShopComponent(props) {
  const [cartShop, setCartShop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cantCartShop, setCantCartShop] = useState(0);
  const [totalCartShop, setTotalCartShop] = useState(0);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setCantCartShop('Calculando...');
    setTotalCartShop('0');

    let _data = [];
    const cart = await AsyncStorage.getItem('cart-shop');
    if (cart === null) {
      const data = JSON.stringify([]);
      await AsyncStorage.setItem('cart-shop', data);
    } else {
      _data = JSON.parse(cart);
    }

    // por tienda -> id: id_tienda
    const productsItems = [];
    const shopsAll = [];
    const shops = [];

    // tiedas
    await _data.map(item =>
      shopsAll.push({name: item.shop.name, _id: item.shop._id}),
    );
    shopsAll.map(shop => {
      // verificar si ya esta en la lista
      let exist = false;
      shops.map(sh => {
        if (sh._id === shop._id) {
          exist = true;
        }
      });
      if (!exist) {
        shops.push(shop);
      }
    });
    let totalCant = 0;
    let total = 0;
    shops.map(shop => {
      // items -> productos de la categoria
      const items = _data.filter(p => p.shop_id === shop._id);
      items.map(product => {
        totalCant += product.cant_shop;
        total += parseFloat(product.total);
      });

      productsItems.push({
        shop: shop,
        data: items,
      });
    });

    setCantCartShop(totalCant);
    setTotalCartShop(total);

    setCartShop(productsItems);
    setLoading(false);
  }

  async function clearCartShop() {
    await AsyncStorage.setItem('cart-shop', JSON.stringify([]));
    load();
  }

  async function deleteOfCartShop(id) {
    const data = await AsyncStorage.getItem('cart-shop');
    let newProducts = [];
    if (data !== null) {
      const products = JSON.parse(data);
      products.map(p => {
        if (p._id !== id) {
          newProducts.push(p);
        }
      });
    }
    newProducts = JSON.stringify(newProducts);
    await AsyncStorage.setItem('cart-shop', newProducts);

    await load();
  }

  async function changeCant(action, item) {
    let cart = await AsyncStorage.getItem('cart-shop');

    let existItem = false;
    let deleteItem = false;
    if (cart !== null) {
      cart = JSON.parse(cart);
      await cart.map((p, index) => {
        if (p._id === item._id) {
          existItem = true;
          // aumentar o disminuri segun la accion
          action ? (cart[index].cant_shop += 1) : (cart[index].cant_shop -= 1);
          // calcular total
          cart[index].total = parseFloat(
            cart[index].cant_shop * parseFloat(cart[index].price),
          );
          // validar si hay que eliminarlo
          if (cart[index].cant_shop <= 0) {
            deleteItem = true;
            cart[index].delete = true;
          }
        }
      });
      // si disminuyen su cantidad a 0 o menor se quita del carrito
      let products = cart;
      if (deleteItem) {
        products = await cart.filter(p => p.delete !== true);
      }
      await AsyncStorage.setItem('cart-shop', JSON.stringify(products));
      await load();
    }
    if (!existItem) {
      alert(
        'El producto este presentado problemas, por favor retirelo de su carrito de compras.',
      );
    }
  }

  // agregar producto al carrito de compras
  async function addToCart(product) {
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

    // actualizar storage
    await AsyncStorage.setItem('cart-shop', JSON.stringify(_products));
    await load();
  }

  return (
    <View style={styles.content}>
      <SafeAreaView style={styles.scroll}>
        {loading ? (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{color: 'orange', fontSize: 18, fontWeight: 'bold'}}>
              Cargando, por favor espera...
            </Text>
          </View>
        ) : (
          <SectionList
            style={{padding: 10}}
            sections={cartShop}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
              <View style={styles.viewSectionList}>
                <View style={styles.itemProduct}>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('DetailsProduct', {
                        name: item.name,
                        product: item,
                        addToCart: addToCart,
                      })
                    }>
                    <Image
                      style={styles.itemImage}
                      source={require('../../assets/images/more3.jpg')}
                    />
                  </TouchableOpacity>
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 10}}>
                      {item.name}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text>Uni: {FORMAT_CURRENCEY(item.price)} </Text>
                      <Text>
                        | Total:{' '}
                        <Text>{FORMAT_CURRENCEY(item.total) ?? 0}</Text>
                      </Text>
                    </View>

                    <View style={styles.contentCant}>
                      <TouchableOpacity
                        style={styles.cantMinus}
                        onPress={() => changeCant(false, item)}>
                        <FontAwesome5Icon
                          name={'minus'}
                          size={20}
                          color="grey"
                        />
                      </TouchableOpacity>
                      <Text style={styles.cant}>{item.cant_shop}</Text>
                      <TouchableOpacity
                        style={styles.cantPlus}
                        onPress={() => changeCant(true, item)}>
                        <FontAwesome5Icon
                          name={'plus'}
                          size={20}
                          color="grey"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={{marginRight: 20}}
                  onPress={() => deleteOfCartShop(item._id)}>
                  <FontAwesome5Icon name={'trash'} size={20} color="#DBDBDB" />
                </TouchableOpacity>
              </View>
            )}
            renderSectionHeader={({section: {shop}}) => (
              <View style={styles.headerB}>
                <View style={styles.headerList}>
                  <Image
                    style={styles.imageHeader}
                    source={require('../../assets/images/more3.jpg')}
                  />
                  <Text style={styles.headerItemList}>{shop.name}</Text>
                </View>
                <TouchableOpacity
                  style={{marginRight: 20}}
                  onPress={() =>
                    props.navigation.navigate('DetailsShop', {
                      name: 'Detalles de la tienda',
                      shop: shop,
                    })
                  }>
                  <FontAwesome5Icon
                    name={'arrow-circle-right'}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        <View style={styles.contentDelete}>
          <TouchableOpacity
            style={styles.total}
            onPress={() => props.navigation.navigate('CreateOrder')}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {cantCartShop}
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {FORMAT_CURRENCEY(totalCartShop)}
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>CONTINUAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnNext}
            onPress={() => clearCartShop()}>
            <FontAwesome5Icon name={'trash'} size={20} color="red" />
            <Text style={{color: 'red', marginLeft: 10, fontWeight: 'bold'}}>
              Limpiar mi carrito
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {props.route.params.link === '0' ? (
        <TabsComponent active="2" navigation={props.navigation} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    flex: 1,
  },
  main: {
    flex: 1,
    padding: 20,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    backgroundColor: 'black',
    padding: 10,
  },
  btnNext: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    padding: 10,
    marginTop: 10,
  },
  viewSectionList: {
    flexDirection: 'row',    
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 6,
    paddingLeft: 10,
    marginBottom: 6,
  },
  itemProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImage: {width: 66, height: 66, borderRadius: 10},
  contentDelete: {
    margin: 10,
    justifyContent: 'center',
  },
  headerItemList: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  headerB: {
    paddingLeft: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
    marginTop: 20,
  },
  headerList: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageHeader: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  contentCant: {
    flexDirection: 'row',
    marginTop: 10,
    width: 100,
    justifyContent: 'space-around',
  },
  cantMinus: {
    backgroundColor: '#EFEFEF',
    padding: 4,
    borderRadius: 4,
  },
  cant: {
    color: 'grey',
    marginLeft: 6,
    marginRight: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cantPlus: {
    backgroundColor: '#EFEFEF',
    padding: 4,
    borderRadius: 4,
  },
});
