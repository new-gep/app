import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { IMAGES } from '../constants/Images';
import { COLORS, FONTS } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import ThemeBtn from '../components/ThemeBtn';
import { useDispatch } from 'react-redux';
import { closeDrawer } from '../redux/actions/drawerAction';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuItems = [
    {
        id:"0",
        icon: IMAGES.home,
        name: "Home",
        navigate: "Home",
    },
    // {
    //     id:"1",
    //     icon: IMAGES.producta,
    //     name: "Products",
    //     navigate: "Products",
    // },
    // {
    //     id:"2",
    //     icon: IMAGES.components,
    //     name: "Components",
    //     navigate: "Components",
    // },
    // {
    //     id:"3",
    //     icon: IMAGES.star,
    //     name: "Featured",
    //     navigate: "Writereview",
    // },
    // {
    //     id:"4",
    //     icon: IMAGES.heart,
    //     name: "Wishlist",
    //     navigate: "Wishlist",
    // },
    // {
    //     id:"5",
    //     icon: IMAGES.order,
    //     name: "My Orders",
    //     navigate: 'Myorder',
    // },
    // {
    //     id:"6",
    //     icon: IMAGES.shopping,
    //     name: "My Cart",
    //     navigate: 'MyCart',
    // },
    // {
    //     id:"7",
    //     icon: IMAGES.chat,
    //     name: "Chat List",
    //     navigate: 'Chat',
    // },
    // {
    //     id:"8",
    //     icon: IMAGES.user3,
    //     name: "Profile",
    //     navigate: "Profile",
    // },
    {
        id:"9",
        icon: IMAGES.logout,
        name: "Logout",
        navigate: 'SingIn',
        onPress: async () => {
            // Lógica de logout
            await AsyncStorage.clear();
        } // Adicionando função onPress customizada para o logout
    },
]

const DrawerMenu = () => {

    const theme = useTheme();
    const dispatch = useDispatch();

    

    const { colors } : {colors : any} = theme;

   const [active, setactive] = useState(MenuItems[0]);

    const navigation = useNavigation<any>();

    return (
        <ScrollView contentContainerStyle={{flexGrow:1}}>
            <View
                className='flex-1 px-4 py-4'
                style={{
                    backgroundColor:colors.background,
                }}
            >
                {/* <View
                    style={{
                        alignItems:'center',
                        paddingVertical:30,
                        paddingRight:10
                    }}
                >
                    <Image
                        style={{height:35,width:114}}
                        source={theme.dark ? IMAGES.appnamedark :IMAGES.appname}
                    />
                </View> */}
                <View
                    style={[GlobalStyleSheet.flex,{
                        paddingHorizontal:15,
                        paddingBottom:20
                    }]}
                >
                    <Text style={{...FONTS.fontSemiBold,fontSize:20,color:colors.title}}>Menu</Text>
                    <TouchableOpacity
                        focusable={false}
                        onPress={() => dispatch(closeDrawer())}
                        activeOpacity={0.5}
                    >
                        <Feather size={24} color={colors.title} name='x'/>
                    </TouchableOpacity>
                </View>
                <View style={{paddingBottom:10}}>
                    {MenuItems.map((data:any,index:any) => {
                        return(
                            <TouchableOpacity
                                focusable={false}
                                activeOpacity={0.8}
                                onPress={async () => {
                                    if (data.onPress) {
                                        await data.onPress();
                                    }
                                    dispatch(closeDrawer());
                                    navigation.navigate(data.navigate);
                                }}
                                key={index}
                                style={[GlobalStyleSheet.flex,{
                                    paddingVertical:5,
                                    marginBottom:0,
                                }]}
                            >
                                <View style={{flexDirection:'row',alignItems:'center',gap:20}}>
                                    <View className="h-[45px] w-[45px] rounded-[10px] items-center justify-center">
                                        {data.id === '0' ? (
                                            <View className="bg-dark rounded-full p-2 items-center justify-center">
                                                <Image
                                                    source={data.icon}
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                        tintColor: COLORS.primary,
                                                        resizeMode: 'contain'
                                                    }}
                                                />
                                            </View>
                                        ) : (
                                            <Image
                                                source={data.icon}
                                                style={{
                                                    height: 24,
                                                    width: 24,
                                                    tintColor: data.id == '9' ? '#FF8484' : '#BDBDBD',
                                                    resizeMode: 'contain'
                                                }}
                                            />
                                        )}
                                    </View>
                                    <Text style={[FONTS.fontRegular,{color:colors.title,fontSize:16,opacity:.6},data.id === '0' && {...FONTS.fontSemiBold,fontSize:16,color:COLORS.dark}]}>{data.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {/* <View style={{paddingHorizontal:10}}>
                    <ThemeBtn />
                </View> */}
                <View style={{paddingVertical:15,paddingHorizontal:10}}>
                    <Text style={{...FONTS.fontMedium,fontSize:16,color:'#868686'}}>Gep</Text>
                    <Text style={{...FONTS.fontMedium,fontSize:12,color:'#B1B1C3'}}>App Version 1.0.0</Text>
                </View>
            </View> 
        </ScrollView>
    )
}

export default DrawerMenu