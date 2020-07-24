import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

// componentes
import SearchComponent from '../SearchComponent';

// categorias
import CATEGORYS from '../utils/categorys_shops.json';
import TabsComponent from './TabsComponent';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {URL} from '../utils/api-url';

export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorys: CATEGORYS.filter(c => c.home === true),
    };
  }
  render() {
    return (
      <View style={styles.content}>
        <SafeAreaView style={styles.scroll}>
          <ScrollView style={styles.scrollContent}>
            <View style={styles.main}>
              <SearchComponent />
              <View style={styles.contentCategory}>
                {this.state.categorys.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.contentCategoryItem}
                    onPress={() =>
                      this.props.navigation.navigate('DetailsCategoryShop', {
                        id: category.id,
                        name: category.name,
                      })
                    }>
                    <Image
                      style={styles.contentCategoryImage}
                      source={{uri: `${URL}${category.image}`}}
                    />
                    <Text style={styles.contentCategoryTitle}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.seeMoreCategoys}
                  onPress={() =>
                    this.props.navigation.navigate('AllCategoryShop')
                  }>
                  <Text style={styles.seeMoreCategoysTitle}>Todas las categorias</Text>
                  <FontAwesome5Icon name={'arrow-right'} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.contentMore}>
                <Text style={styles.contentMoreTitle}>
                  Descuentos. ¡Imperdibles!
                </Text>
                <ScrollView horizontal style={styles.contentMoreContentImage}>
                  <Image
                    style={styles.contentMoreImage}
                    source={require('../../assets/images/more3.jpg')}
                  />
                  <Image
                    style={styles.contentMoreImage}
                    source={require('../../assets/images/more3.jpg')}
                  />
                  <Image
                    style={styles.contentMoreImage}
                    source={require('../../assets/images/more3.jpg')}
                  />
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        <TabsComponent active="1" navigation={this.props.navigation} />
      </View>
    );
  }
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
  contentCategory: {
    flexWrap: 'wrap',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 1,
    borderRadius: 10,
  },
  contentCategoryItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 1,
    marginRight: 1,
    width: 90,
  },
  contentCategoryImage: {
    width: 30,
    height: 30,
  },
  contentCategoryTitle: {
    marginTop: 4,
  },
  seeMoreCategoys: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#29d45d',
    padding: 4,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  seeMoreCategoysTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
  contentMore: {
    marginTop: 20,
  },
  contentMoreTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  contentMoreContentImage: {
    marginTop: 10,
    height: 160,
  },
  contentMoreImage: {
    borderRadius: 30,
    height: 150,
    width: 250,
    marginRight: 10,
    marginLeft: 2,
  },
});
