import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

import PostsScreen from './PostsScreen';
import CreatePostScreen from './CreatPostsScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false, 
        tabBarStyle: styles.tabBar, 
        tabBarShowLabel: false,
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
      }} 
    >
      <Tab.Screen name="Posts" 
                  component={PostsScreen} 
                  style={styles.tabBarItem}
                  options={{ tabBarIcon: ({ focused }) => ( 
                    <Image 
                        source={require('../Img/grid.png')} 
                        style={[styles.tabBarIcon, ]} />
                    ), 
                  }}
      />
      <Tab.Screen name="CreatePost" 
                  component={CreatePostScreen} 
                  style={styles.tabBarItem}
                  options={{ 
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ focused }) => (
                    <Image 
                        source={require('../Img/newPost.png')} 
                        style={[styles.tabBarIcon, ]} 
                      />
                    ), 
                  }}
      />
      <Tab.Screen name="Profile" 
                  component={ProfileScreen} 
                  style={styles.tabBarItem}
                  options={{ tabBarIcon: ({ focused }) => (
                    <Image 
                        source={require('../Img/user.png')} 
                        style={[styles.tabBarIcon, ]} 
                      />
                    ),
                  }}
      />
    </Tab.Navigator>
  );
};

const CustomTabBarButton = ({ children, onPress }) => ( 
  <TouchableOpacity 
    style={styles.customTabBarButton} 
    onPress={onPress} 
  > 
    {children} 
  </TouchableOpacity> 
);

const styles = StyleSheet.create({ 
  tabBar: {
    borderTopWidth: 1,
    height: 83, 
    borderColor: '#BDBDBD', 
    paddingHorizontal: 82,
    paddingTop: 15,
    // paddingBottom: 34,
    
  },

  tabBarItem: { 
    flex: 1, 
    justifyContent: 'center',
    
  },

  customTabBarButton: {
    alignItems: 'center',
    justifyContent: 'center',

  },

});

export default HomeScreen;
