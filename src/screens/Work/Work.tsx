import React, { useState } from 'react'
import {  useTheme } from '@react-navigation/native';
import { View ,ScrollView, Image, Text } from 'react-native'
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { COLORS, FONTS } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/reducer/cartReducer';
import { removeFromwishList } from '../../redux/reducer/wishListReducer';
import Cardstyle2 from '../../components/Card/Cardstyle2';



const cardData =[
    {
        id:"0",
        image:IMAGES.item1,
        title:"Hot Creamy Cappuccino Latte Ombe",
        price:"$12.6",
        brand:"Coffee",
    },
    {
        id:"1",
        image:IMAGES.item2,
        title:"Hot Cappuccino Latte with Mocha",
        price:"$13.6",
        brand:"Coffee",
    },
    {
        id:"2",
        image:IMAGES.item3,
        title:"Sweet Lemon Indonesian Tea",
        price:"$51.6",
        brand:"Tea, Lemon",
    },
    {
        id:"3",
        image:IMAGES.item13,
        title:"Arabica Latte Ombe Coffee",
        price:"$51.6",
        brand:"Coffee",
    },
    {
        id:"4",
        image:IMAGES.item14,
        title:"Original Latte Ombe Hot Coffee ",
        price:"$51.6",
        brand:"Coffee",
    },
]

type WishlistScreenProps = StackScreenProps<RootStackParamList, 'Work'>;

const Work = ({navigation} : WishlistScreenProps) => {

    const wishList = useSelector((state:any) => state.wishList.wishList);
    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const addItemToCart = (data: any) => {
        dispatch(addToCart(data));
    }

    const removeItemFromWishList = (data: any) => {
        dispatch(removeFromwishList(data));
    }

  return (
     <View style={{backgroundColor:colors.background,flex:1}}>
        <Header
          title='Meu Trabalho'
          leftIcon={'back'}
          rightIcon1={'search'}
          //titleLeft
        />
        <ScrollView  className={`bg-white`} contentContainerStyle={{flexGrow:1,justifyContent:wishList.length === 0 ? 'center' : 'flex-start',}}>
            <View className={`bg-white`} style={[GlobalStyleSheet.container,{padding:15,alignItems:'center'}]}>
                  <View className={`h-full w-full`}>
                    <Text className={`absolute left-20 top-10`} style={{...FONTS.fontSemiBold,fontSize:20,color:COLORS.dark,}}>
                        Em Desenvolvimento
                    </Text>
                    <Image
                            source={IMAGES.gif0}
                            resizeMode='contain'
                            className={`h-full w-full`}
                        />
                  </View>
              </View>
        </ScrollView>
     </View>
  )
}

export default Work