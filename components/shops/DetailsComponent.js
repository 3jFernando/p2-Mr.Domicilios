import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FORMAT_CURRENCEY from '../utils/format_cash';

// componentes
import ProductComponent from '../products/ProductComponent';

import {URL_API} from '../utils/api-url';

export default function DetailsComponent(props) {
  const {shop} = props.route.params;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cantProducts, setCantProducts] = useState(0);

  // cargar productos de la tienda
  useEffect(() => {
    fetch(
      URL_API+'/products/shop/by-cateogory/' + shop._id,
    )
      .then(response => response.json())
      .then(json => {
        setProducts(json.products);
        setCantProducts(json.cant);
      })
      .catch(e => alert('No es posible cargar los datos en este momento'))
      .finally(() => setLoading(false));
  }, [shop._id]);

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
  }

  return (
    <View style={styles.content}>
      <View style={{flex: 1}}>
        <View style={styles.main}>
          <View style={styles.header}>
            <Image
              style={styles.photo}
              source={require('../../assets/images/more3.jpg')}
            />
            <Text style={styles.name}>{shop.name} </Text>
          </View>
        </View>
        <View style={{padding: 10, alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>
            Entrega aprox: {shop.time_number}-{shop.time_type}
          </Text>
          <Text style={{fontWeight: 'bold'}}>
            Valor domicilio: {FORMAT_CURRENCEY(shop.value_delivery)}
          </Text>
        </View>
      </View>
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : cantProducts > 0 ? (
          <SectionList
            style={styles.list}
            sections={products}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
              <ProductComponent
                item={item}
                addToCart={addToCart}
                navigation={props.navigation}
              />
            )}
            renderSectionHeader={({section: {category}}) => (
              <Text style={styles.headerItemList}>{category}</Text>
            )}
          />
        ) : (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{color: 'orange', fontSize: 18, fontWeight: 'bold'}}>
              La tienda no tiene porductos para mostrar.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 0,
  },
  safeArea: {flex: 3, marginTop: 20, paddingBottom: 10},
  viewSectionList: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 5,
    borderBottomStartRadius: 210,
    height: 130,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'white',
  },
  photo: {
    width: 70,
    borderRadius: 100,
    height: 70,
  },
  list: {
    padding: 10,
  },
  headerItemList: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
  },
});
