import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';

// componentes
import TabsComponent from './TabsComponent';

import FORMAT_CURRENCEY from '../utils/format_cash';
import {URL_API} from '../utils/api-url';

export default function OrdersComponent(props) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        const _client = JSON.parse(clientSession)._id;
        await Axios.get(
          URL_API+'/orders/clients/' + _client,
        )
          .then(response => {
            const data = response.data.orders;
            setOrders(data);
          })
          .catch(e => alert('No es posible cargar los datos en este momento.'))
          .finally(() => setLoading(false));
      }
    };
    load();
  }, [props.navigation]);

  return (
    <View style={styles.content}>
      <SafeAreaView style={styles.scroll}>
        <ScrollView>
          <View style={{margin: 10}}>
            {loading ? (
              <ActivityIndicator size="large" color="#000000" />
            ) : (
              orders.map(order => (
                <TouchableOpacity
                  style={styles.contentItem}
                  onPress={() =>
                    props.navigation.navigate('DetailsOrder', {
                      order,
                    })
                  }>
                  <Image
                    source={require('../../assets/images/more3.jpg')}
                    style={{width: 80, height: 80, borderRadius: 10}}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 5}}>
                      {order.shop !== null
                        ? order.shop.name
                        : 'Tienda no encontrada'}
                    </Text>
                    <Text>{order.create_at}</Text>
                    <Text style={styles.total}>
                      Total: {FORMAT_CURRENCEY(order.total)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <TabsComponent active="5" navigation={props.navigation} />
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
  contentItem: {
    marginBottom: 6,
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    padding: 10,
  },
  total: {
    fontWeight: 'bold',
    marginTop: 5,
  },
});
