import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Axios from 'axios';

import {URL_API, URL} from '../../utils/api-url';
import Loading from '../../utils/loading';
import {showToast} from '../../utils/toast-android';

export default function FavoriteComponent(props) {
  const [loading, setLoading] = useState(false);
  const [advertisings, setAdvertising] = useState([]);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      await Axios.get(`${URL_API}/advertising/all`)
        .then(response => {
          const status = response.data.status;
          if (status === 200) {
            setAdvertising(response.data.advertisings);
          }
        })
        .catch(e => showToast('No es posible cargar los datos'))
        .finally(() => setLoading(false));
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.scroll}>
      {loading && <Loading />}
      <ScrollView horizontal={props.view}>
        {advertisings.map(ad => (
          <View key={ad._id} style={props.view && {width: 330}}>
            <TouchableOpacity
              onPress={() => {
                ad.type === 'Producto'
                  ? props.navigation.navigate('DetailsProduct', {
                      name: ad.entity.name,
                      product: ad.entity,
                      shop: ad.shop,
                    })
                  : props.navigation.navigate('DetailsShop', {
                      name: 'Detalles de la tienda',
                      shop: ad.shop,
                    });
              }}
              style={styles.item}>
              <Image
                style={styles.image}
                source={
                  ad.image === null || ad.image === undefined || ad.image === ''
                    ? require('../../../assets/images/delivery.jpeg')
                    : {uri: `${URL}${ad.image}`}
                }
              />
              <View style={styles.itemContent}>
                <Text style={styles.title}>{ad.entity.name}</Text>
                <Text style={{fontSize: 16, color: 'white'}}>{ad.type}</Text>
                <Text style={styles.disscount}>
                  {ad.disscount}% de Descuento
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  item: {
    height: 200,
    position: 'relative',
    marginBottom: 5,
    zIndex: 100,
  },
  itemContent: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 20, 0.6)',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'white',
  },
  disscount: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 35,
    color: 'white',
  },
  image: {
    height: 200,
  },
});
