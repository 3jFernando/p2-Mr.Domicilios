import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import TabsComponent from '../TabsComponent';

// librerias
import MapView, {Marker} from 'react-native-maps';
import Axios from 'axios';

// helpers
import {URL, URL_API} from '../../utils/api-url';
import {showToast} from '../../utils/toast-android';

// componentes
import Loading from '../../utils/loading';
import SearchComponent from '../../SearchComponent';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default class MapComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shops: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.load();
  }

  // cargar las tiendas
  async load() {
    this.setState({loading: true});
    await Axios.get(`${URL_API}/shops`)
      .then(response => {
        if (response.data.status === 200) {
          this.setState({
            shops: response.data.shops,
          });
        }
      })
      .catch(e => {
        showToast('No es posible cargar los datos.');
      })
      .finally(() => this.setState({loading: false}));
  }

  // ver marcador -> tienda
  async goToMarkerShop(shop) {
    const camera = await this.map.getCamera();
    camera.center = {
      latitude: parseFloat(shop.address_lat),
      longitude: parseFloat(shop.address_lgn),
    };
    camera.zoom = 16;

    this.map.animateCamera(camera, {duration: 2000});
  }

  async applyZoom(action) {
    const camera = await this.map.getCamera();
    if (action) {
      camera.zoom += 1;
    } else {
      camera.zoom -= 1;
    }
    this.map.animateCamera(camera, {duration: 1000});
  }

  render() {
    return (
      <View style={styles.content}>
        <MapView
          ref={ref => {
            this.map = ref;
          }}
          style={{flex: 1}}
          initialCamera={{
            center: {
              latitude: 1.85371,
              longitude: -76.05071,
            },
            pitch: 45,
            heading: 0,
            altitude: 0,
            zoom: 6,
          }}>
          {this.state.shops.map(shop => (
            <Marker
              key={shop._id}
              title={shop.name}
              description={`Tel: ${shop.phone}. Ct.Envio: ${
                shop.value_delivery
              }`}
              coordinate={{
                latitude: parseFloat(shop.address_lat),
                longitude: parseFloat(shop.address_lgn),
              }}
              pinColor="#29d45d"
            />
          ))}
        </MapView>
        <View style={styles.containerSearchs}>
          <View style={styles.searchs}>
            <SearchComponent
              goToMarkerShop={this.goToMarkerShop}
              map={this.map}
              isMap={true}
            />
          </View>
        </View>
        <View style={styles.controlsZoom}>
          <TouchableOpacity
            style={styles.zoom}
            onPress={() => this.applyZoom(true)}>
            <FontAwesome5Icon name="plus" color="#29d45d" size={17} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoom}
            onPress={() => this.applyZoom(false)}>
            <FontAwesome5Icon name="minus" color="#29d45d" size={17} />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.containerShops}>
          <ScrollView horizontal>
            {this.state.loading ? (
              <Loading />
            ) : (
              this.state.shops.map(shop => (
                <View key={shop._id}>
                  <View style={styles.containerShopsDetails}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('DetailsShop', {
                          name: 'Detalles de la tienda',
                          shop: shop,
                        })
                      }>
                      <Image
                        style={styles.shopsImage}
                        source={
                          shop.photo === null ||
                          shop.photo === '' ||
                          shop.photo === undefined
                            ? require('../../../assets/images/delivery.jpeg')
                            : {uri: `${URL}${shop.photo}`}
                        }
                      />
                    </TouchableOpacity>
                    <Text style={styles.shopsTitle}>{shop.name}</Text>
                    <TouchableOpacity
                      style={styles.shopsDetails}
                      onPress={() => this.goToMarkerShop(shop)}>
                      <Text style={{color: 'white'}}>Ver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
        <TabsComponent active="3" navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  containerSearchs: {
    position: 'absolute',
    top: 2,
    width: '100%',
    padding: 10,
  },
  searchs: {
    borderRadius: 10,
    backgroundColor: 'white',
  },
  containerShops: {
    position: 'absolute',
    width: '98%',
    height: 135,
    backgroundColor: 'white',
    bottom: 58,
    borderRadius: 20,
    padding: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerShopsDetails: {
    marginRight: 4,
    alignItems: 'center',
    width: 140,
    height: '100%',
  },
  shopsImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },
  shopsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
    height: 20,
    width: 150,
    textAlign: 'center',
  },
  shopsDetails: {
    width: 80,
    height: 30,
    backgroundColor: '#29d45d',
    borderRadius: 6,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsZoom: {
    position: 'absolute',
    bottom: 200,
    right: 10,
  },
  zoom: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
});
