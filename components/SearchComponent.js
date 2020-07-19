import React from 'react';
import {StyleSheet, TextInput, View, Image} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default function SearchComponent() {
  return (
    <View style={styles.contentSearch}>
      <TextInput style={styles.searchInput} placeholder="Buscar.,," />
      <FontAwesome5Icon name={'search'} style={styles.searchIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  contentSearch: {
    height: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    height: 20,
    width: 20,
    borderRadius: 50,
    position: 'absolute',
    top: 14,
    left: 19,
  },
  searchInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#F8F8F8',
    paddingLeft: 45,
    borderRadius: 10,
  },
});
