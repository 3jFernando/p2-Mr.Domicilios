import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function TabsComponent(props) {
  const [activeMenu1, setActiveMenu1] = useState('#ccc');
  const [activeMenu2, setActiveMenu2] = useState('#ccc');
  const [activeMenu3, setActiveMenu3] = useState('#ccc');
  const [activeMenu4, setActiveMenu4] = useState('#ccc');
  const [activeMenu5, setActiveMenu5] = useState('#ccc');

  const {active: menuActive} = props;

  useEffect(() => {
    if (menuActive == 1) {
      setActiveMenu1('#29d45d');
    } else if (menuActive == 2) {
      setActiveMenu2('#29d45d');
    } else if (menuActive == 3) {
      setActiveMenu3('#29d45d');
    } else if (menuActive == 4) {
      setActiveMenu4('#29d45d');
    } else if (menuActive == 5) {
      setActiveMenu5('#29d45d');
    }
  }, [menuActive]);

  return (
    <View style={styles.navFooter}>
      <TouchableOpacity
        style={styles.navFooterItem}
        onPress={() => props.navigation.navigate('Home')}>
        <FontAwesome5 name={'home'} size={20} color={activeMenu1} />
        <Text style={(styles.navFooterItemTitle, {color: activeMenu1})}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navFooterItem}
        onPress={() => props.navigation.navigate('Promotions')}>
        <FontAwesome5 name={'truck-loading'} size={20} color={activeMenu2} />
        <Text style={(styles.navFooterItemTitle, {color: activeMenu2})}>
          Promos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navFooterItem}
        onPress={() => props.navigation.navigate('Map')}>
        <FontAwesome5 name={'map'} size={20} color={activeMenu3} />
        <Text style={(styles.navFooterItemTitle, {color: activeMenu3})}>
          Mapa
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navFooterItem}
        onPress={() => props.navigation.navigate('Favorites')}>
        <FontAwesome5 name={'heart'} size={20} color={activeMenu4} />
        <Text style={(styles.navFooterItemTitle, {color: activeMenu4})}>
          Favoritos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navFooterItem}
        onPress={() => props.navigation.navigate('Orders')}>
        <FontAwesome5 name={'list'} size={20} color={activeMenu5} />
        <Text style={(styles.navFooterItemTitle, {color: activeMenu5})}>
          Ordenes
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  navFooter: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
  navFooterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navFooterItemImage: {
    width: 26,
    height: 26,
  }, 
});
