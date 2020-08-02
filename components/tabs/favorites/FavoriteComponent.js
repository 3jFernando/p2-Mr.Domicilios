import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import TabsComponent from '../TabsComponent';

import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {URL_API, URL} from '../../utils/api-url';
import Loading from '../../utils/loading';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

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
          <View style={styles.headerList}>
              <Text>Productos Favoritos</Text>
              <FontAwesome5Icon name={'list'} color='#29d45d' size={15} />
            </View>
            {loading ? (
              <Loading />
            ) : (
              favorites.map(favorite => (
                <TouchableOpacity
                  key={favorite._id}
                  style={{marginBottom: 5, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#F8F8F8'}}
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
                      style={{width: 30, height: 30, borderRadius: 50}}
                      source={{uri: `${URL}${favorite.entity.image}`}}
                    />
                    <View style={{marginLeft: 10}}>
                      <Text>
                        {favorite.entity.name}
                      </Text>
                      <Text style={{color: 'gray'}}>
                        {favorite.type}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
            <View style={styles.headerList}>
              <Text>Tiendas Guardadas</Text>
              <FontAwesome5Icon name={'list'} color='#29d45d' size={15} />
            </View>
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
  headerList: {
    marginBottom: 20,
    marginTop: 10,
    flexDirection:'row', 
    justifyContent: 'space-between', 
    borderBottomColor: '#F8F8F8',
  },
});
