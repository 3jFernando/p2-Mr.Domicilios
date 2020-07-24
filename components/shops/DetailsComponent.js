import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SectionList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FORMAT_CURRENCEY from '../utils/format_cash';

// componentes
import ProductComponent from '../products/ProductComponent';

import {URL_API} from '../utils/api-url';
import Axios from 'axios';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default function DetailsComponent(props) {
  const {shop} = props.route.params;
  const [client, setClient] = useState({_id: null});

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cantProducts, setCantProducts] = useState(0);

  // cargar productos de la tienda
  useEffect(() => {
    const validSession = async () => {
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        setClient(JSON.parse(clientSession));
        await Axios.get(
          URL_API +
            '/products/shop/by-cateogory/' +
            shop._id +
            '/' +
            client._id,
        )
          .then(response => {
            setProducts(response.data.products);
            setCantProducts(response.data.cant);
          })
          .catch(e => alert('No es posible cargar los datos en este momento'))
          .finally(() => setLoading(false));
      }
    };
    validSession();
  }, [client._id, shop._id]);

  return (
    <View style={styles.container}>
      <View style={styles.main1}>
        <Image
          style={styles.imageBackground}
          source={require('../../assets/images/more3.jpg')}
        />
      </View>

      <View style={styles.main2}>
        <Image
          style={styles.image}
          source={require('../../assets/images/more3.jpg')}
        />
        <Text style={styles.name}>{shop.name}</Text>
        <Text style={styles.description}>
          Entrega aprox: {shop.time_number}-{shop.time_type}
        </Text>
        <Text style={styles.description}>
          Valor domicilio: {FORMAT_CURRENCEY(shop.value_delivery)}
        </Text>
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
                  navigation={props.navigation}
                  shop={shop}
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
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 3, marginTop: 20, paddingBottom: 10},
  viewSectionList: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
