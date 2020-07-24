import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FORMAT_CURRENCEY from '../utils/format_cash';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {addToCart} from '../products/actions';
import {addToFavorite} from '../tabs/favorites/actions';
import AsyncStorage from '@react-native-community/async-storage';

import {URL} from '../utils/api-url';

export default function DetailsComponent(props) {
  const [client, setClient] = useState(null);
  const {product, shop} = props.route.params;

  useEffect(() => {
    const validClient = async () => {
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        setClient(JSON.parse(clientSession));
      }
    };
    validClient();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.main1}>
        <Image
          style={styles.imageBackground}
          source={{uri: `${URL}${product.image}`}}
        />
        <Text style={styles.namePrice}>Precio</Text>
        <Text style={styles.price}>{FORMAT_CURRENCEY(product.price)}</Text>
      </View>

      <View style={styles.main2}>
        <Image style={styles.image} source={{uri: `${URL}${product.image}`}} />
        <TouchableOpacity
          style={styles.ItemStar}
          onPress={() => addToFavorite(client._id, 'Producto', product._id)}>
          <FontAwesome5 name={'heart'} size={24} color="#29d45d" />
        </TouchableOpacity>
        <ScrollView style={styles.flex}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <TouchableOpacity
            style={styles.btnAdd}
            onPress={() => addToCart(product, shop)}>
            <FontAwesome5 name={'plus'} size={15} color="white" />
            <Text style={{color: 'white', fontWeight: 'bold', paddingLeft: 10}}>
              AGREGAR
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    flex: 1.5,
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
  },
  image: {
    position: 'absolute',
    width: 180,
    height: 180,
    right: 30,
    top: -110,
    borderRadius: 6,
  },
  namePrice: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 80,
    marginLeft: 20,
  },
  description: {
    color: 'gray',
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  ItemStar: {
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    top: 30,
    left: 20,
    backgroundColor: '#F8F8F8',
    zIndex: 1,
  },
  btnAdd: {
    margin: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#29d45d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
