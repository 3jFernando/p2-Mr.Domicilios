import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import TabsComponent from '../TabsComponent';

import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {URL_API, URL} from '../../utils/api-url';

export default function FavoriteComponent(props) {
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const validSession = async () => {
      const clientSession = await AsyncStorage.getItem('client-session');
      if (clientSession !== null) {
        const client = JSON.parse(clientSession);
        setLoading(true);
        await Axios.get(URL_API + '/favorites/client/' + client._id)
          .then(response => {
            setFavorites(response.data.favorites);
            favorites.map(p => console.log(p));
          })
          .catch(e =>
            alert('Ocurrio un error al tratar de realizar la accion.'),
          )
          .finally(() => setLoading(false));
      }
    };
    validSession();
  }, []);

  return (
    <View style={styles.content}>
      <SafeAreaView style={styles.scroll}>
        <ScrollView>
          <View style={styles.main}>
            {loading ? (
              <View style={{alignItems: 'center', marginTop: 20}}>
                <ActivityIndicator size="large" color="#29d45d" />
              </View>
            ) : (
              favorites.map(favorite => (
                <TouchableOpacity
                  key={favorite._id}
                  style={{marginBottom: 15}}
                  onPress={() =>
                    props.navigation.navigate('DetailsProduct', {
                      name: favorite.entity.name,
                      product: favorite.entity,
                      shop: favorite.shop,
                    })
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{width: 50, height: 50, borderRadius: 50}}
                      source={{uri: `${URL}${favorite.entity.image}`}}
                    />
                    <View style={{marginLeft: 10}}>
                      <Text style={{fontWeight: 'bold'}}>
                        {favorite.entity.name}
                      </Text>
                      <Text style={{fontWeight: 'bold', color: 'gray'}}>
                        {favorite.type}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <TabsComponent active="4" navigation={props.navigation} />
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
});
