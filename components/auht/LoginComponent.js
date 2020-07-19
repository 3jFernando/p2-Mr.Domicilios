import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import {URL_API} from '../utils/api-url';

export default function LoginComponent(props) {
  const [titleLogin, setTitleLogin] = useState('Iniciar sesion');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const validSession = async () => {
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        props.navigation.navigate('Home');
      }
    };
    validSession();
  }, []);

  async function login() {
    setTitleLogin('Ingresando ...');
    await axios
      .post(URL_API+'/clients/login', {
        email: email,
        password: password,
      })
      .then(response => {
        const res = response.data;
        const status = res.status;
        const message = res.message;
        
        if (status === 460) {
          alert(message);
        } else if (status === 470) {
          alert(message);
        } else if (status === 200) {
          AsyncStorage.setItem('client-session', JSON.stringify(res.client));
          props.navigation.navigate('Home');
        }
      })
      // error
      .catch(e => {
        alert('Upps, ocurrio un error al tratar de realizar la accion.');          
      })
      .then(() => setTitleLogin('Iniciar sesion')); // terminado
  }

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.main}>
          <TextInput
            keyboardType="email-address"
            style={styles.mainInput}
            placeholder="Correo electronico"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            keyboardType="default"
            style={styles.mainInput}
            placeholder="Clave de usuario"
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity style={styles.buttonLogin} onPress={() => login()}>
            <Text style={styles.buttonLoginTitle}>{titleLogin}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flex: 1,
    padding: 20,
  },
  mainInput: {},
  buttonLogin: {
    marginTop: 15,
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
  },
});
