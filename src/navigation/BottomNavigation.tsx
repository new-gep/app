import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './BottomTabParamList';
import WishlistScreen from '../screens/Wishlist/Wishlist';
import MyCartScreen from '../screens/MyCart/MyCart';
import WorkScreen from '../screens/Work/Work';
import VacancyScreen from '../screens/Vacancy/Home';
import HomeScreen from '../screens/Home/Home';
import ProfileScreen from '../screens/Profile/Profile';
import ProfilScreen from '../screens/Profile/Profil';
import DocumentsScreen from '../screens/Documents/Documents';
import BottomMenu from '../layout/BottomMenu';
import { useTheme } from '@react-navigation/native';
import Default from '../screens/Cycle/Index'


const Tab = createBottomTabNavigator<BottomTabParamList>();


const BottomNavigation = () => {

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown : false
            }}
            tabBar={(props:any) => <BottomMenu {...props}/>}
        >
            <Tab.Screen 
                name='Início'
                component={HomeScreen}
            />
            <Tab.Screen 
                name='Favoritos'
                component={VacancyScreen}
            />
            <Tab.Screen 
                name='Trabalho'
                component={Default}
            />
            <Tab.Screen 
                name='Menu'
                component={ProfilScreen}
            />
        </Tab.Navigator>
    )
}

export default BottomNavigation;