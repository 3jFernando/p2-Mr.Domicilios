import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

import {URL} from '../utils/api-url';
import FORMAT_CURRENCEY from '../utils/format_cash';
import {addToCart} from '../products/actions';
import {addToFavorite} from '../tabs/favorites/actions';

export default function ProductComponent(props) {
  const [client, setClient] = useState(null);
  const [product, setProduct] = useState(props.item);
  const [favorite, setFavorite] = useState();

  useEffect(() => {
    setFavorite(product.favorite);
    const validSession = async () => {
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        setClient(JSON.parse(clientSession));
      }
    };
    validSession();
  }, [product.favorite]);

  return (
    <View style={styles.viewSectionList}>
      <View style={styles.itemProduct}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('DetailsProduct', {
              name: product.name,
              product: product,
              shop: props.shop,
            })
          }>
          <Image
            style={styles.itemImage}
            source={{uri: `${URL}${product.image}`}}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 10}}>
          <Text
            style={{fontWeight: 'bold', marginBottom: 10}}
            onPress={() =>
              props.navigation.navigate('DetailsProduct', {
                name: product.name,
                product: product,
                shop: props.shop,
              })
            }>
            {product.name}
          </Text>
          <Text>Valor: {FORMAT_CURRENCEY(product.price)} </Text>
          <TouchableOpacity
            style={styles.btnAdd}
            onPress={() => addToCart(product, props.shop)}>
            <FontAwesome5 name={'plus'} size={15} color="white" />
            <Text style={{color: 'white', fontWeight: 'bold'}}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.ItemStar}
        onPress={() =>
          client !== null && addToFavorite(client._id, 'Producto', product._id)
        }>
        <FontAwesome5 name={'heart'} size={30} color="#29d45d" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  viewSectionList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 6,
    paddingLeft: 10,
    marginBottom: 5,
  },
  itemProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImage: {width: 60, height: 60, borderRadius: 10},
  ItemStar: {
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
  },
  btnAdd: {
    marginTop: 3,
    width: 100,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#29d45d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
