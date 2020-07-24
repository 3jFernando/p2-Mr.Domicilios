import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FORMAT_CURRENCEY from '../utils/format_cash';
import Axios from 'axios';
import socketIOClient from 'socket.io-client';

import {URL, URL_API} from '../utils/api-url';

export default function CreateComponent(props) {
  const [shops, setShops] = useState([]);
  const [total, setTotal] = useState(0);
  const [total_delivery, setTotalDelivery] = useState(0);
  const [client, setClient] = useState(null);
  const [cantOrders, setCantOrders] = useState(0);
  const [loading, setLoading] = useState('CONFIRMAR Y CREAR');
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);

  // cargar productos de la tienda
  useEffect(() => {
    setLoading('Actualizando, espera...');

    setSocket(socketIOClient(URL));

    const load = async () => {
      // cliente
      const client = await AsyncStorage.getItem('client-session');
      if (client === null) {
        alert(
          'Debes volver a iniciar tu sesion para continuar, disculpa las molestias!',
        );
        props.navigation.navigate('Login');
      } else {
        setClient(JSON.parse(client));
      }

      // shops
      let _total = 0;
      let _totalDelivery = 0;
      let _cantShops = 0; // para saber cuantas ordenes se van a generar
      const shops_ = [];
      const shopsSearch = await AsyncStorage.getItem('cart-shop');
      if (shopsSearch === null) {
        alert(
          'Tu carrito de compras esta presentando problemas, por favor vacialo y vuelve a interlo.',
        );
        return false;
      } else {
        // por tienda -> id: id_tienda
        const shopsAll = [];
        const _data = JSON.parse(shopsSearch);

        // tiedas
        await _data.map(item =>
          shopsAll.push({
            name: item.shop.name,
            _id: item.shop._id,
            total: item.total,
            value_delivery: item.shop.value_delivery,
          }),
        );
        shopsAll.map(shop => {
          // verificar si ya esta en la lista
          let exist = false;
          shops_.map(sh => {
            if (sh._id === shop._id) {
              exist = true;
            }
          });
          if (!exist) {
            shops_.push(shop);
            _cantShops++;
            _totalDelivery += parseFloat(shop.value_delivery);
          }
          _total += parseFloat(shop.total);
        });
        const data_ = [];
        shops_.map(shop => {
          // items -> productos de la categoria
          const items = _data.filter(p => p.shop_id === shop._id);
          data_.push({
            shop: shop,
            products: items,
          });
        });

        setData(data_);
        setShops(shops_);
        setTotal(_total);
        setTotalDelivery(_totalDelivery);
        setCantOrders(_cantShops);
      }
      setLoading('CONFIRMAR Y CREAR');
    };

    load();
  }, [props.navigation]);

  // crear orden
  async function createOrder() {
    setLoading('Creando orden, espera...');
    await Axios.post(URL_API + '/orders', {
      client_id: client._id,
      total_delivery: total_delivery,
      total: total,
      data: data,
    })
      .then(response => {

        const orders = response.data.orders;
        console.log(orders);

        orders.map(item => {
          socket.emit('new-order-connected', item.shop_id);
          socket.emit('new-order', item.shop_id, item);
        });

        alert('Orden generada con exito!');
        clearCartShop();
        props.navigation.navigate('Orders');
      })
      .catch(e => {
        console.log(e);
        alert(
          'No es posible realizar la accion en este momento, asegurate de estar conectado a Internet.',
        );
      })
      .finally(() => setLoading('CONFIRMAR Y CREAR'));
  }

  async function clearCartShop() {
    await AsyncStorage.setItem('cart-shop', JSON.stringify([]));
  }

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView>
        <View style={{margin: 20}}>
          <View style={styles.addressContent}>
            <FontAwesome5Icon name={'list'} color="red" size={20} />
            <View style={{marginLeft: 14}}>
              <Text style={{fontWeight: 'bold', color: 'red'}}>IMPORTANTE</Text>
              <Text style={(styles.address, {color: 'red'})}>
                Se van a generar {cantOrders} ordenes.
              </Text>
            </View>
          </View>
          <View style={styles.addressContent}>
            <FontAwesome5Icon name={'map-marker-alt'} color="gray" size={20} />
            <View style={{marginLeft: 20}}>
              <Text style={styles.addressTitle}>DIRECION</Text>
              {client !== null ? (
                <Text style={styles.address}>
                  {client.city} | {client.address}
                </Text>
              ) : (
                <Text style={styles.address} />
              )}
            </View>
          </View>
          <View style={styles.addressNoteContent}>
            <FontAwesome5Icon
              style={styles.addressNoteIcon}
              name={'pencil-alt'}
              color="gray"
              size={16}
            />
            <TextInput
              style={styles.addressNote}
              placeholder="Ayudanos, Describe el sitio."
            />
          </View>
          <ScrollView horizontal style={styles.shops}>
            {shops.map(shop => (
              <TouchableOpacity key={shop._id} style={styles.shopsItem}>
                <Image
                  style={styles.shopsImage}
                  source={require('../../assets/images/more3.jpg')}
                />
                <Text style={styles.shopsName}>{shop.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ItemTotal name="total orden" number={total} />
          <ItemTotal name="valor domicilio" number="2000" />
          <ItemTotal name="total a pagar" number={total} />
          <View style={styles.btnFinish}>
            <TouchableOpacity
              style={styles.total}
              onPress={() => createOrder()}>
              <Text
                style={{color: 'white', fontWeight: 'bold', paddingRight: 10}}>
                {loading}
              </Text>
              <FontAwesome5Icon name={'paper-plane'} size={15} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ItemTotal = function(props) {
  return (
    <View style={styles.data}>
      <FontAwesome5Icon name={'money-bill-alt'} color="black" size={20} />
      <View style={{marginLeft: 20}}>
        <Text style={styles.dataTitle}>{props.name}</Text>
        <Text style={styles.dataTotal}>{FORMAT_CURRENCEY(props.number)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  addressContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    marginTop: 10,
  },
  addressTitle: {
    fontWeight: 'bold',
  },
  address: {
    fontWeight: 'bold',
    fontSize: 13,
    color: 'gray',
  },
  addressNoteContent: {
    marginTop: 10,
    position: 'relative',
  },
  addressNote: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 40,
  },
  addressNoteIcon: {
    position: 'absolute',
    left: 10,
    top: 15,
  },
  btnFinish: {
    margin: 20,
    padding: 12,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  data: {
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: '#F8F8F8',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  dataTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 15,
  },
  dataTotal: {
    fontWeight: 'bold',
  },
  shops: {
    height: 85,
    marginTop: 12,
  },
  shopsItem: {
    marginRight: 6,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  shopsImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  shopsName: {
    width: 70,
    overflow: 'hidden',
    textAlign: 'center',
    height: 20,
  },
});
