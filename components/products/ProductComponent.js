import React from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FORMAT_CURRENCEY from '../utils/format_cash';

export default function ProductComponent(props) {
  return (
    <View style={styles.viewSectionList}>
      <View style={styles.itemProduct}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('DetailsProduct', {
              name: props.item.name,
              product: props.item,
              addToCart: props.addToCart,
            })
          }>
          <Image
            style={styles.itemImage}
            source={require('../../assets/images/more3.jpg')}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 10}}>
          <Text
            style={{fontWeight: 'bold', marginBottom: 10}}
            onPress={() =>
              props.navigation.navigate('DetailsProduct', {
                name: props.item.name,
                product: props.item,
              })
            }>
            {props.item.name}
          </Text>
          <Text>Valor: {FORMAT_CURRENCEY(props.item.price)} </Text>
          <TouchableOpacity
            style={styles.btnAdd}
            onPress={() => props.addToCart(props.item)}>
            <FontAwesome5 name={'plus'} size={15} color="white" />
            <Text style={{color: 'white', fontWeight: 'bold'}}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.ItemStar}>
        <FontAwesome5 name={'heart'} size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  viewSectionList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
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
  itemImage: {width: 90, height: 90, borderRadius: 10},
  ItemStar: {
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btnAdd: {
    marginTop: 3,
    width: 100,
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
