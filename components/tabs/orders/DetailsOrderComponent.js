import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Axios from 'axios';

// component

import FORMAT_CURRENCEY from '../../utils/format_cash';
import {URL, URL_API} from '../../utils/api-url';
import {showToast} from '../../utils/toast-android';
import {ScrollView} from 'react-native-gesture-handler';

export default function DetailsOrderComponent(props) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (props.shop !== null) {
      const load = async () => {
        setLoading(true);
        await Axios.get(
          `${URL_API}/orders/details/${props.route.params.order._id}`,
        )
          .then(response => {
            if (response.data.status === 200) {
              setOrder(response.data.order);
            } else {
              showToast(
                'Algo salio mal al trartar de realizar la accion, intentalo mas tarde.',
              );
            }
          })
          .catch(e => alert('No es posible realizar la accion en este momento'))
          .finally(() => setLoading(false));
      };
      load();
    }
  }, [props.route.params.order._id, props.shop]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {loading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <View style={styles.container}>
          {order === null ? (
            <Text>La orden esta presentando problemas</Text>
          ) : (
            <View style={{flex: 1}}>
              <View style={styles.main1}>
                <Image
                  style={styles.imageBackground}
                  source={
                    order.shop.photo === null ||
                    order.shop.photo === undefined ||
                    order.shop.photo === ''
                      ? require('../../../assets/images/delivery.jpeg')
                      : {uri: `${URL}${order.shop.photo}`}
                  }
                />
              </View>
              <View style={styles.main2}>
                <Image
                  style={styles.image}
                  source={
                    order.shop.photo === null ||
                    order.shop.photo === undefined ||
                    order.shop.photo === ''
                      ? require('../../../assets/images/delivery.jpeg')
                      : {uri: `${URL}${order.shop.photo}`}
                  }
                />
                <Text style={styles.name}>{order.shop.name}</Text>
                <Text style={styles.description}>
                  Entrega aprox: {order.shop.time_number}-{order.shop.time_type}
                </Text>
                <Text style={styles.description}>
                  Estado de la orden: {order.state}
                </Text>
                <Text style={styles.description}>
                  Valor domicilio: {FORMAT_CURRENCEY(order.value_delivery)}
                </Text>
                <Text style={styles.description}>
                  Valor Total: {FORMAT_CURRENCEY(order.total)}
                </Text>
                <SafeAreaView style={{flex: 1,margingTop: 20, paddingTop: 20,}}>
                  <ScrollView>
                    {order.products.map(product => (
                      <View
                        key={product._id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 5,
                          marginTop: 5,
                        }}>
                        <Image
                          style={{width: 30, height: 30, borderRadius: 6}}
                          source={{uri: `${URL}${product.product.image}`}}
                        />
                        <View style={{marginLeft: 10}}>
                          <Text style={{fontWeight: 'bold'}}>
                            {product.product.name}
                          </Text>
                          <Text style={{fontWeight: 'bold', color: 'gray'}}>
                            Cantidad {product.cant}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </SafeAreaView>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',    
  },
  main1: {
    flex: 0.7,
    backgroundColor: 'black',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  main2: {
    flex: 2,
    borderTopLeftRadius: 70,
    backgroundColor: '#FFFFFF',
    marginTop: -60,
    paddingTop: 20,
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    marginTop: 10,
    marginRight: 10,
  },
  description: {
    color: 'gray',
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  image: {
    position: 'absolute',
    width: 100,
    height: 100,
    right: 30,
    top: -70,
    borderRadius: 10,
  },
});
