import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default function StartComponent(props) {

  useEffect(() => {
    const validSession = async () => {
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        props.navigation.navigate('Home');
      }
    };
    validSession();
  }, []);

  return (
    <View style={styles.content}>
      <View style={styles.contentLogo}>
        <Image
          style={styles.logo}
          source={require('../assets/images/categorys_shops/2.png')}
        />
      </View>
      <View style={styles.contentMain}>
        <TouchableOpacity
          style={styles.btnActions}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.titleActions}>Iniciar sesion</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnActions}
          onPress={() => props.navigation.navigate('CreateAccount')}>
          <Text style={styles.titleActions}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentFooter}>
        <TouchableOpacity style={styles.btnFooter}>
          <Text>Terminos y condiciones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentLogo: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 150,
  },
  contentMain: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btnActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    height: 40,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  titleActions: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentFooter: {
    flex: 0.5,
  },
  btnFooter: {
    backgroundColor: 'white',
    fontSize: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
