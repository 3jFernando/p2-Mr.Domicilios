import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import FORMAT_CURRENCEY from '../utils/format_cash';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {addToCart} from '../products/actions';
import {addToFavorite} from '../tabs/favorites/actions';
import AsyncStorage from '@react-native-community/async-storage';

import {URL, URL_API} from '../utils/api-url';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import {showToast} from '../utils/toast-android';

// confirguracion de tabs
const Tab = createBottomTabNavigator();

export default function DetailsComponent(props) {
  const [client, setClient] = useState(null);
  const {product, shop} = props.route.params;
  const [textReview, setReview] = useState('');
  const [creatingReview, setCreatingReview] = useState('Guardar');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    validClient();
  }, []);

  // validar sesion del usuario
  const validClient = async () => {
    const clientSession = await AsyncStorage.getItem('client-session');
    if (clientSession !== null) {
      setClient(JSON.parse(clientSession));
      loadReviews();
    }
  };

  // cargar reseñas
  const loadReviews = async () => {
    await Axios.get(`${URL_API}/reviews/${product._id}`)
      .then(response => {
        if (response.data.status === 200) {
          setReviews(response.data.reviews);
        }
      })
      .catch(e => {
        console.log(e);
        showToast('NO es posible cargar los datos.');
      });
  };

  // crear reseñas
  const storeReview = async () => {
    setCreatingReview('Creando, espera...');
    await Axios.post(`${URL_API}/reviews`, {
      entity_id: product._id,
      review: textReview,
      name: client.name,
      photo: client.photo,
    })
      .then(response => {
        if (response.data.status === 200) {
          showToast('Tu opinion se agrego con exito');
          setReviews([...reviews, response.data.review]);
          setReview('');
        }
      })
      .catch(e => {
        console.log(e);
        showToast('NO es posible realizar la accion.');
      })
      .finally(() => setCreatingReview('Guardar'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.main1}>
        <Image
          style={styles.imageBackground}
          source={
            product.image === null || product.image === ''
              ? require('../../assets/images/delivery.jpeg')
              : {uri: `${URL}${product.image}`}
          }
        />
        <Text style={styles.namePrice}>Precio</Text>
        <Text style={styles.price}>{FORMAT_CURRENCEY(product.price)}</Text>
      </View>

      <View style={styles.main2}>
        <Image
          style={styles.image}
          source={
            product.image === null || product.image === ''
              ? require('../../assets/images/delivery.jpeg')
              : {uri: `${URL}${product.image}`}
          }
        />
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: '#29d45d',
            inactiveTintColor: 'gray',
          }}
          screenOptions={({route}) => ({
            tabBarIcon: () => {
              return route.name === 'Detalles' ? (
                <FontAwesome5Icon
                  name={'info-circle'}
                  color={route.color}
                  size={20}
                />
              ) : (
                <FontAwesome5Icon
                  name={'history'}
                  color={route.color}
                  size={20}
                />
              );
            },
          })}>
          <Tab.Screen name="Detalles" component={DetailsScreen} />
          <Tab.Screen name="Opiniones" component={ReviewsScreen} />
        </Tab.Navigator>
      </View>
    </View>
  );

  function DetailsScreen({route}) {
    route.color = '#29d45d';

    return (
      <ScrollView style={styles.scrolls}>
        <TouchableOpacity
          style={styles.ItemStar}
          onPress={() => addToFavorite(client._id, 'Producto', product._id)}>
          <FontAwesome5 name={'heart'} size={24} color="#29d45d" />
        </TouchableOpacity>

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
    );
  }

  function ReviewsScreen({route}) {
    route.color = '#29d45d';

    return (
      <ScrollView style={styles.scrolls}>
        <Text style={styles.titleReviews}>Opiniones!</Text>

        <View style={{}}>
          <TextInput
            id="review"
            style={styles.txtReviews}
            value={textReview}
            onChangeText={text => setReview(text)}
            placeholder="Deja tu opinion sobre este producto."
          />
          <TouchableOpacity
            onPress={() => storeReview()}
            style={styles.btnStoreReviews}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {creatingReview}
            </Text>
          </TouchableOpacity>
        </View>

        {reviews.map(review => (
          <View style={styles.reviews} key={review._id}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 20, height: 20, borderRadius: 50}}
                source={require('../../assets/images/delivery.jpeg')}
              />
              <View style={{marginLeft: 6}}>
                <Text style={{fontWeight: 'bold'}}>{review.name}</Text>
                <Text style={{color: 'grey'}}>{review.created_at}</Text>
              </View>
            </View>
            <Text style={{margin: 26, marginTop: 10, marginBottom: 10}}>
              {review.review}
            </Text>
            <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <FontAwesome5Icon
                style={{margin: 26, marginRight: 0, marginTop: 10, marginBottom: 10}}
                name={'thumbs-up'}
                size={25}
                color="#29d45d"
              />
              <Text style={{marginLeft: 12,}}>{review.likes}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }
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
    marginTop: -60,
  },
  image: {
    position: 'absolute',
    width: 150,
    height: 150,
    right: 30,
    top: -110,
    borderRadius: 6,
    zIndex: 10,
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
    marginTop: 60,
  },
  description: {
    color: 'gray',
    fontSize: 15,
    marginTop: 10,
  },
  ItemStar: {
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    left: 0,
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
  scrolls: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 20,
  },
  titleReviews: {
    color: '#29d45d',
    fontWeight: 'bold',
    fontSize: 20,
  },
  reviews: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 6,
    marginBottom: 20,
  },
  btnStoreReviews: {
    backgroundColor: '#29d45d',
    marginTop: 6,
    padding: 8,
    width: 100,
    alignItems: 'center',
    borderRadius: 6,
  },
  txtReviews: {
    marginTop: 20,
    height: 100,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#CCCCCC',
    padding: 10,
  },
});
