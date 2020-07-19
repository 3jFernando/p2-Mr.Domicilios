import React from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FORMAT_CURRENCEY from '../utils/format_cash';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function DetailsComponent(props) {
  const {product, addToCart} = props.route.params;

  return (
    <View style={styles.container}>
      <View style={styles.main1}>
        <Text style={styles.namePrice}>Precio</Text>
        <Text style={styles.price}>{FORMAT_CURRENCEY(product.price)}</Text>
      </View>

      <View style={styles.main2}>
        <Image
          style={styles.image}
          source={require('../../assets/images/1.jpeg')}
        />
        <TouchableOpacity style={styles.ItemStar}>
          <FontAwesome5 name={'heart'} size={70} color="#FFFFFF" />
        </TouchableOpacity>
        <ScrollView style={styles.flex}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <TouchableOpacity
            style={styles.btnAdd}
            onPress={() => addToCart(product)}>
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
    flex: 1,
    backgroundColor: 'black',
    paddingLeft: 20,
    paddingTop: 20,
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
    borderRadius: 10,
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
    top: -60,
    right: 80,
    backgroundColor: 'rgba(1,1,1, 0.4)',
  },
  btnAdd: {
    margin: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
