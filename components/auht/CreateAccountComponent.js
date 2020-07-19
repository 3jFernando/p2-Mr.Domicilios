import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default class CreateAccountComponent extends Component {
  render() {
    return (
      <SafeAreaView style={styles.scroll}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.main}>
            <TextInput style={styles.mainInput} placeholder="Nombre" value="" />
            <TextInput
              style={styles.mainInput}
              placeholder="Correo electronico"
              value=""
            />
            <TextInput
              style={styles.mainInput}
              placeholder="Clave de usuario"
              value=""
            />
            <TextInput
              style={styles.mainInput}
              placeholder="Telefono"
              value=""
            />
            <TextInput style={styles.mainInput} placeholder="Ciudad" value="" />
            <TextInput
              style={styles.mainInput}
              placeholder="Direccion"
              value=""
            />
            <TouchableOpacity style={styles.buttonLogin}>
              <Text style={styles.buttonLoginTitle}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flex: 3,
    padding: 20,
  },
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
