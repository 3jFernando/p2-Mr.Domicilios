import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';

import CATEGORYS from '../utils/categorys_shops.json';

export default function AllComponent(props) {
  const [categorys, setCategorys] = useState([]);

  useEffect(() => {
    setCategorys(CATEGORYS);
  }, []);

  return (
    <SafeAreaView style={styles.content}>
      <ScrollView>
        {categorys.map(category => (
          <TouchableOpacity
            key={category.id}
            style={styles.contentItems}
            onPress={() =>
              props.navigation.navigate('DetailsCategoryShop', {
                id: category.id,
                name: category.name,
              })
            }>
            <Image
              style={styles.itemImage}
              source={require('../../assets/images/categorys_shops/2.png')}
            />
            <Text style={styles.itemTitle}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentItems: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 36,
    height: 36,
    borderRadius: 50,
    marginRight: 10,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
});
