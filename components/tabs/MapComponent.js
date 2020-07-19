import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, View, Text} from 'react-native';
import TabsComponent from './TabsComponent';

export default class FavoriteComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.content}>
        <SafeAreaView style={styles.scroll}>
          <ScrollView>
            <View style={styles.main}>
              <Text>Hola </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
        <TabsComponent active="2" navigation={this.props.navigation} />
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
});
