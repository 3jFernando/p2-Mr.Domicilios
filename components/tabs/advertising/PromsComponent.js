import React from 'react';
import {StyleSheet, View} from 'react-native';
import AdvertisingData from './AdvertisingData';

import TabsComponent from '../TabsComponent';
export default function FavoriteComponent(props) {
  return (
    <View style={styles.content}>
      <AdvertisingData view={false} navigation={props.navigation} />
      <TabsComponent active="2" navigation={props.navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,    
    backgroundColor: 'white',
  },
});
