import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import SearchComponent from '../SearchComponent';
import {URL_API} from '../utils/api-url';

export default function DetailsComponentComponent(props) {
  const [shops, setShops] = useState([]);
  const [cantShops, setCantShops] = useState(0);
  const [isLoading, setLoading] = useState(true);

  const {id: idCategory} = props.route.params;

  useEffect(() => {
    fetch(URL_API+'/shops/category/' + idCategory)
      .then(response => response.json())
      .then(json => {
        setCantShops(json.cant);
        setShops(json.shops);
      })
      .catch(e => alert('No es posible cargar las tiendas en este momento'))
      .finally(() => setLoading(false));
  }, [idCategory]);

  return (
    <View style={styles.content}>
      <View style={styles.mainContent}>
        <View style={styles.headerTitle}>
          <FontAwesome5Icon name={'list'} color="black" />
          <Text style={styles.subtitles}>Categorias de las Tiendas</Text>
        </View>
        <SafeAreaView>
          <ScrollView horizontal>
            <View style={styles.categoryContent}>
              <TouchableOpacity style={styles.categoryItem}>
                <Image
                  style={styles.imageCategory}
                  source={require('../../assets/images/delivery.jpeg')}
                />
                <Text>Hamburguesas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <Image
                  style={styles.imageCategory}
                  source={require('../../assets/images/delivery.jpeg')}
                />
                <Text>Empanadas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <Image
                  style={styles.imageCategory}
                  source={require('../../assets/images/delivery.jpeg')}
                />
                <Text>Desayunos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <Image
                  style={styles.imageCategory}
                  source={require('../../assets/images/delivery.jpeg')}
                />
                <Text>Cafes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <Image
                  style={styles.imageCategory}
                  source={require('../../assets/images/delivery.jpeg')}
                />
                <Text>Jugos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem}>
                <Image
                  style={styles.imageCategory}
                  source={require('../../assets/images/delivery.jpeg')}
                />
                <Text>Ropa</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
      <SearchComponent />

      <SafeAreaView style={styles.contentShops}>
      <View style={styles.headerTitle}>
          <FontAwesome5Icon name={'list'} color="black" />
          <Text style={styles.subtitles}>Tiendas recomendadas</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : cantShops > 0 ? (
          <FlatList
            data={shops}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.itemShop}
                onPress={() =>
                  props.navigation.navigate('DetailsShop', {
                    name: 'Detalles de la tienda',
                    shop: item,
                  })
                }>
                <Image
                  style={styles.itemShopImage}
                  source={require('../../assets/images/more3.jpg')}
                />
                <View style={{marginLeft: 10,}}>
                  <Text style={styles.itemShopTitle}>{item.name}</Text>
                  <Text>
                    Entrega aprox: {item.time_number}-{item.time_type}
                  </Text>
                  <Text>Valor domicilio: COP{item.value_delivery}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>
            Lo sentimos por el momento no tenemos tiendas registradas para esta
            categoria.
          </Text>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },  
  categoryContent: {
    flexDirection: 'row',
    height: 66,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 6,
  },
  categoryItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  imageCategory: {
    width: 30,
    height: 30,
  },
  main: {
    flex: 1,
  },
  mainContent: {
    marginTop: 5,
  },
  contentShops: {
    marginTop: 10,
    flex: 1,
  },
  subtitles: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  itemShop: {    
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 6,
    paddingLeft: 10,
    marginBottom: 5,
  },
  itemShopImage: {width: 70, height: 70, borderRadius: 10, marginRight: 6},
  itemShopTitle: {
    marginBottom: 10, 
    fontWeight: 'bold',
  },
});
