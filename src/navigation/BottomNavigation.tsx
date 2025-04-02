import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './BottomTabParamList';
import WishlistScreen from '../screens/Wishlist/Wishlist';
import MyCartScreen from '../screens/MyCart/MyCart';
import WorkScreen from '../screens/Work/Work';
import VacancyScreen from '../screens/Vacancy/Home';
import HomeScreen from '../screens/Home/Home';
import ProfileScreen from '../screens/Profile/Profile';
import DocumentsScreen from '../screens/Documents/Documents';
import BottomMenu from '../layout/BottomMenu';
import { useTheme } from '@react-navigation/native';
import Default from '../screens/Cycle/Default'


const Tab = createBottomTabNavigator<BottomTabParamList>();


const BottomNavigation = () => {

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown : false
            }}
            tabBar={(props:any) => <BottomMenu {...props}/>}
        >
            <Tab.Screen 
                name='Home'
                component={HomeScreen}
            />
            <Tab.Screen 
                name='Work'
                component={VacancyScreen}
            />
            <Tab.Screen 
                name='Documents'
                component={Default}
            />
            <Tab.Screen 
                name='Profile'
                component={ProfileScreen}
            />

            
        </Tab.Navigator>
    )
}

export default BottomNavigation;