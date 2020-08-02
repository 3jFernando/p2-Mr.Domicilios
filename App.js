/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// navegacion
import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity, Text, Alert} from 'react-native';
//import notifee from '@notifee/react-native';

// componentes
import StartComponent from './components/StartComponent';
import LoginComponent from './components/auht/LoginComponent';
import CreateAccountComponent from './components/auht/CreateAccountComponent';
import HomeComponent from './components/tabs/HomeComponent';
import MapComponent from './components/tabs/map/MapComponent';
import PromsComponent from './components/tabs/advertising/PromsComponent';
import OrdersComponent from './components/tabs/orders/OrdersComponent';
import FavoriteComponent from './components/tabs/favorites/FavoriteComponent';
import DetailsComponent from './components/categorys_shops/DetailsComponent';
import ShopsDetailsComponent from './components/shops/DetailsComponent';
import CartShopComponent from './components/tabs/CartShopComponent';
import DetailsProductComponent from './components/products/DetailsComponent';
import AccountComponent from './components/client/AccountComponent';
import CreateOrderComponent from './components/tabs/orders/CreateComponent';
import DetailsOrderComponent from './components/tabs/orders/DetailsOrderComponent';
// fuentes de iconos
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

// db asyncrona storage
import AsyncStorage from '@react-native-community/async-storage';

import socketIOCLIENT from 'socket.io-client';
import {URL} from './components/utils/api-url';

const Stack = createStackNavigator();

export default function App(props) {
  useEffect(() => {
    const validSession = async () => {
      let client = await AsyncStorage.getItem('client-session');
      if (client !== null) {
        client = JSON.parse(client);

        const socket = socketIOCLIENT(URL);
        // pendiente de ordenes - orden en camino
        socket.emit('order-on-the-way-connect', client._id);
        socket.on('order-on-the-way', (__connect, payload) => {
          /*Alert.alert(
            'Orden en camino!',
            'Enhorabuena, tu orden ya esta en camino...',
            [
              {
                text: 'Ok',
                style: 'cancel',
              },
              {
                text: 'Ver detalles',
                onPress: () => {},
              },
            ],
            {cancelable: false},
          );*/
          alert("Domicilio en camino");
        });
      }
    };
    validSession();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#29d45d',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: null,
          gesturesEnabled: false,
        }}>
        <Stack.Screen
          name="Welcome"
          options={{title: 'Mr. Domicilios'}}
          component={StartComponent}
        />
        <Stack.Screen
          name="Login"
          options={{title: 'Iniciar sesion'}}
          component={LoginComponent}
        />
        <Stack.Screen
          name="CreateAccount"
          options={{title: 'Crear cuenta'}}
          component={CreateAccountComponent}
        />
         <Stack.Screen
          name="Map"
          options={{
            title: 'Buscar tiendas',
            headerLeft: () => <Account />,
            headerRight: () => <Cart />,
          }}
          component={MapComponent}
          screenOptions={{
            headerLeft: null,
            gesturesEnabled: false,
          }}
          />
        <Stack.Screen
          name="Home"
          options={{
            title: 'Explorar tiendas',            
          }}
          component={HomeComponent}
        />       
        <Stack.Screen
          name="Promotions"
          options={{
            title: 'Promociones',
            headerRight: () => <Cart />,
          }}
          component={PromsComponent}
        />
        <Stack.Screen
          name="Favorites"
          options={{
            title: 'Favoritos',
            headerRight: () => <Cart />,
          }}
          component={FavoriteComponent}
        />
        <Stack.Screen
          name="Orders"
          options={{title: 'Tus ordenes'}}
          component={OrdersComponent}
        />
        <Stack.Screen
          name="DetailsCategoryShop"
          options={({route}) => ({
            title: route.params.name,
            headerRight: () => <Cart />,
          })}
          component={DetailsComponent}
        />
        <Stack.Screen
          name="DetailsShop"
          options={{
            title: 'Detalles de la tienda',
            headerRight: () => <Cart />,
          }}
          component={ShopsDetailsComponent}
        />
        <Stack.Screen
          name="CartShop"
          options={{title: 'Carrito de compras'}}
          component={CartShopComponent}
        />
        <Stack.Screen
          name="AccountClient"
          options={{title: 'Tu cuenta'}}
          component={AccountComponent}
        />
        <Stack.Screen
          name="DetailsProduct"
          options={({route}) => ({
            title: route.params.name,
          })}
          component={DetailsProductComponent}
        />
        <Stack.Screen
          name="CreateOrder"
          options={{title: 'Confirmar orden!'}}
          component={CreateOrderComponent}
        />
        <Stack.Screen
          name="DetailsOrder"
          options={{title: 'Detalles de la orden'}}
          component={DetailsOrderComponent}
        />
      </Stack.Navigator>          
    </NavigationContainer>
  );
}

function Account() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{marginLeft: 25}}
      onPress={() => navigation.navigate('AccountClient')}>
      <FontAwesome5Icon name={'user'} color="white" size={20} />
    </TouchableOpacity>
  );
}

function Cart() {
  const navigation = useNavigation();
  const [cant, setCant] = useState(0);

  const loadCart = async () => {
    const cartShop = await AsyncStorage.getItem('cart-shop');
    if (cartShop !== null) {
      const data = JSON.parse(cartShop);
      let totalCant = 0;
      await data.map(p => totalCant++);
      setCant(totalCant);
    }
  };

  loadCart();

  return (
    <TouchableOpacity
      style={{flexDirection: 'row', justifyContent: 'center', marginRight: 10}}
      onPress={() =>
        navigation.navigate('CartShop', {
          link: '1',
        })
      }>
      <FontAwesome5Icon
        style={{marginRight: 4}}
        name={'cart-plus'}
        size={20}
        color="white"
      />
      <Text style={{color: 'white', fontWeight: 'bold'}}>{cant}</Text>
    </TouchableOpacity>
  );
}
