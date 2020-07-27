import React from 'react';
import {ActivityIndicator, View} from 'react-native';

export default function(props) {
  return (
    <View style={{alignItems: 'center', marginTop: 20}}>
      <ActivityIndicator size="large" color="#29d45d" />
    </View>
  );
}
