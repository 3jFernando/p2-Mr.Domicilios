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
import {URL} from '../utils/api-url';

export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorys: CATEGORYS,
    };
  }
  render() {
    return (
      <View style={styles.content}>
        <SafeAreaView style={styles.scroll}>
          <ScrollView style={styles.scrollContent}>
            <View style={styles.main}>
              <SearchComponent isMap={false} navigation={this.props.navigation} />
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
    padding: 0,
  },
  main: {
    flex: 1,
    padding: 20,
  },
  contentCategory: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'stretch',
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
  },
  contentCategoryItem: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    height: 120,
    width: 160,
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  contentCategoryImage: {
    width: 60,
    height: 60,
    marginTop: 30,
    borderRadius: 50,
  },
  contentCategoryTitle: {
    top: 10,
    left: 10,
    position: 'absolute',
  },
});
