import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Text, Image} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import {URL, URL_API} from './utils/api-url';
import Axios from 'axios';
import {showToast} from './utils/toast-android';
import TabsComponent from './tabs/TabsComponent';

export default function SearchComponent(props) {
  const [params, setParams] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const goSearch = query => {
    setParams(query);

    const load = async () => {
      setSearching(true);
      showToast('Buscando...');
      setResults([]);
      await Axios.post(`${URL_API}/shops/search`, {query})
        .then(response => {
          if (response.data.status === 200) {
            setResults(response.data.shops);
          }
        })
        .catch(e => {
          showToast('No es posible cargar los datos.');
        })
        .finally(() => setSearching(false));
    };
    load();
  };

  return (
    <View style={{zIndex: 100}}>
      <View style={styles.contentSearch}>
        <FontAwesome5Icon name={'search'} size={13} style={styles.searchIcon} />
        <TextInput
          id="params"
          style={styles.searchInput}
          placeholder="Buscar tiendas..."
          value={params}
          onChangeText={text => goSearch(text)}
        />
        <Text
          style={
            (styles.searching,
            searching ? {color: '#29d45d'} : {color: 'white'})
          }>
          ...
        </Text>
      </View>
      <SafeAreaView
        style={
          (styles.contentResults,
          params.length > 0 ? {display: 'flex'} : {display: 'none'})
        }>
        <ScrollView style={styles.results}>
          <TouchableOpacity
            style={styles.cancelSearch}
            onPress={() => setParams('')}>
            <Text style={{color: 'red', fontWeight: 'bold'}}>Limpiar</Text>
            <FontAwesome5Icon name={'window-close'} color="red" size={13} />
          </TouchableOpacity>
          <View style={{margin: 20}}>
            {results.map(shop => (
              <View key={shop._id} style={styles.itemResult}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={{uri: `${URL}${shop.photo}`}}
                    style={styles.logoShop}
                  />
                  <Text style={{fontWeight: 'bold'}}>{shop.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSearching(false);
                    setParams('');
                    props.isMap
                      ? props.goToMarkerShop(shop)
                      : props.navigation.navigate('DetailsShop', {
                          name: 'Detalles de la tienda',
                          shop: shop,
                        });
                  }}>
                  <FontAwesome5Icon
                    name={props.isMap ? 'map-marker-alt' : 'eye'}
                    size={20}
                    color="#29d45d"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>      
    </View>
  );
}

const styles = StyleSheet.create({
  contentSearch: {
    height: 50,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  searchIcon: {
    borderRadius: 50,
    position: 'absolute',
    top: 18,
    left: 19,
  },
  searching: {
    position: 'absolute',
    top: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#F8F8F8',
    paddingLeft: 45,
    borderRadius: 10,
  },
  contentResults: {
    flex: 1,
    position: 'relative',
    marginTop: 6,
  },
  results: {
    flex: 1,
    height: '90%',
    maxHeight: 300,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  logoShop: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 50,
  },
  cancelSearch: {
    margin: 20,
    marginBottom: 0,
    backgroundColor: '#F8F8F8',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  itemResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#F8F8F8',
    marginBottom: 4,
    padding: 12,
  },
});
