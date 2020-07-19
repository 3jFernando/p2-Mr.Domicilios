import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Axios from 'axios';

// component

import FORMAT_CURRENCEY from '../utils/format_cash';
import {URL_API} from '../utils/api-url';

export default function DetailsOrderComponent(props) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (props.shop !== null) {
      const load = async () => {
        setLoading(true);
        await Axios.get(
          URL_API+'/orders/details/' +
            props.route.params.order._id,
        )
          .then(response => {
            if (response.data.status === 200) {
              setOrder(response.data.order);
            } else {
              alert(
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
    <SafeAreaView style={styles.content}>
      <ScrollView style={styles.scroll}>
        <View style={{margin: 10}}>
          {loading ? (
            <ActivityIndicator size="large" color="#000000" />
          ) : (
            <View>
              {order === null ? (
                <Text>La orden esta presentando problemas</Text>
              ) : (
                <View>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>TIENDA</Text>
                  <Text>{order.shop.name}</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 20}}>ESTADO</Text>
                  <Text>{order.state}</Text>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 16, marginTop: 20}}>
                    TOTAL
                  </Text>
                  <Text>{FORMAT_CURRENCEY(order.total)}</Text>
                  <View style={{marginTop: 20}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>
                      PRODUCTOS
                    </Text>
                    {order.products.map(product => (
                      <View key={product._id}>
                        <Text>{product.product.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
});
