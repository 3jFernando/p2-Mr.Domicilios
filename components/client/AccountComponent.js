import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {URL_API} from '../utils/api-url';

export default function AccountComponent(props) {
  const [titleAction, setTitleAction] = useState('Actualizar datos');
  const [client, setClient] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const validSession = async () => {
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        setClient(JSON.parse(clientSession));
        setName(client.name);
        setEmail(client.email);
        setPhone(client.phone);
        setAddress(client.address);
        setCity(client.city);
      } else {
        await AsyncStorage.removeItem('client-session');
        props.navigation.navigate('Login');
      }
    };
    validSession();
  }, [
    client.name,
    client.email,
    client.phone,
    client.address,
    client.city,
    props.navigation,
  ]);

  const updateAccount = async () => {
    setTitleAction('Actualizando datos...');

    await axios
      .put(URL_API + '/clients/' + client._id, {
        name: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
      })
      .then(response => {
        const status = response.data.status;
        const message = response.data.message;

        if (status === 460) {
          alert(message);
        } else if (status === 200) {
          AsyncStorage.setItem(
            'client-session',
            JSON.stringify(response.data.client),
          );
          alert('Datos actualizados con exito.');
        }
      })
      .catch(e => {
        console.log(e);
        alert('No es posible realizar la acicon en este momento.')
      })
      .then(() => setTitleAction('Actualizar datos'));
  };

  return (
    <View style={styles.content}>
      <SafeAreaView style={styles.scroll}>
        <ScrollView>
          <View style={styles.main}>
            <Text style={{fontSize: 28, fontWeight: 'bold'}}>
              ¡Hola, {client.name}!
            </Text>
            <View style={styles.main}>
              <TextInput
                style={styles.mainInput}
                placeholder="Nombre"
                value={name}
                onChangeText={text => setName(text)}
              />
              <TextInput
                style={styles.mainInput}
                placeholder="Correo electronico"
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <TextInput
                style={styles.mainInput}
                placeholder="Telefono"
                value={phone}
                onChangeText={text => setPhone(text)}
              />
              <TextInput
                style={styles.mainInput}
                placeholder="Ciudad"
                value={city}
                onChangeText={text => setCity(text)}
              />
              <TextInput
                style={styles.mainInput}
                placeholder="Direccion"
                value={address}
                onChangeText={text => setAddress(text)}
              />
              <TouchableOpacity
                style={styles.buttonLogin}
                onPress={() => updateAccount()}>
                <FontAwesome5 name={'edit'} color="white" />
                <Text style={styles.buttonLoginTitle}>{titleAction}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  main: {
    flex: 1,
    padding: 20,
  },
  buttonLogin: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    height: 40,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  buttonLoginTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
