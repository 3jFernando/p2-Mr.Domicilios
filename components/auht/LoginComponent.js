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

import {showToast} from '../utils/toast-android';
import Loading from '../utils/loading';
import {URL_API} from '../utils/api-url';

export default function LoginComponent(props) {
  const [loading, setLoading] = useState(false);
  const [titleLogin, setTitleLogin] = useState('Iniciar sesion');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const validSession = async () => {
      setLoading(true);
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        props.navigation.navigate('Map');
      }
      setLoading(false);
    };
    validSession();
  }, [props.navigation]);

  async function login() {
    setTitleLogin('Ingresando ...');
    setLoading(true);
    await axios
      .post(`${URL_API}/clients/login`, {
        email: email,
        password: password,
      })
      .then(response => {
        const res = response.data;
        const status = res.status;
        const message = res.message;

        if (status === 460) {
          showToast(message);
        } else if (status === 470) {
          showToast(message);
        } else if (status === 200) {
          AsyncStorage.setItem('client-session', JSON.stringify(res.client));          
          props.navigation.navigate('Map');
        }
      })
      // error
      .catch(e => {
        console.log(e);
        showToast('Upps, ocurrio un error al tratar de realizar la accion.');
      })
      .then(() => {
        setTitleLogin('Iniciar sesion');
        setLoading(false);
      }); // terminado
  }

  return (
    <SafeAreaView style={styles.scroll}>
      <ScrollView style={styles.scrollContent}>
        {loading && <Loading />}
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
    backgroundColor: '#29d45d',
    height: 40,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  buttonLoginTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
});
