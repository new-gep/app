import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, BackHandler } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import ImageSwiper from '../../components/ImageSwiper';
import Cardstyle4 from '../../components/Card/Cardstyle4';
import { openDrawer } from '../../redux/actions/drawerAction';
import ProfileCompletionModal from '../../components/Modal/ProfileLock';
import ValidateCollaboratorAndBlock from '../utils/validateCollaboratorAndBlock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mask from '../../function/mask';
import useCollaborator from '../../function/fetchCollaborator';
import { useCollaboratorContext } from '../../context/CollaboratorContext';
import DevelopmentModal from '../../components/Modal/Development';
import FindOneJob from '../../hooks/get/job/findOne';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

const ArrivalData = [
    {
        id:"1",
        title: "Ponto",
        subtitle:"Atalho",
        image:IMAGES.order
    },
    {
        id:"2",
        title: "Holerite",
        subtitle:"Atalho",
        image:IMAGES.payment
    },
    {
        id:"3",
        title: "Vagas",
        subtitle:"Atalho",
        image:IMAGES.send
    },
    {
        id:"4",
        title: "Ausência",
        subtitle:"Atalho",
        image:IMAGES.chat
    },

];


export default function HomeWork() {
    const SwiperData = [
        
        {
            id:"1",
            image:IMAGES.unique10,
            title:"Holerite",
            subtitle: "Assine e cheque seu pagamento"
        },
        {
            id:"2",
            image:IMAGES.unique11,
            title:"Ausência",
            subtitle: "Envia seu atestado e justificativas"
        },
        {
            id:"3",
            image4:IMAGES.unique12,
            title:"Ponto",
            sule: "Assine e cheque seu ponto"
        },

    ];

    const dispatch = useDispatch();
    const [isShowDevelopment,setIsShowDevelopment] = useState<boolean>(false)
    const navigation = useNavigation<NavigationProp<any>>();
    const theme = useTheme();
    const { colors }: { colors: any; } = theme;
    const { collaborator, fetchCollaborator } = useCollaborator();
    const { validateCollaborator, missingData } = useCollaboratorContext();

    const closeDevelopment = () => {
        setIsShowDevelopment(false)
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCollaborator()
            validateCollaborator()
            const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
                return true;
            });
            return () => backHandlerSubscription.remove();
        });
        return unsubscribe;
    },[])

    
    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <DevelopmentModal close={closeDevelopment} visible={isShowDevelopment}/>
            <View>
            </View>
            <View style={{}}>
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30,padding:0,paddingTop:30 }]}>
                    <View style={[GlobalStyleSheet.flex]}>
                        <View>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Bem-Vindo(a) !</Text>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 24, color: colors.title }}>{collaborator && Mask('firstName', collaborator.name)}</Text>
                        </View>
                        {/* <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Notification')}
                                activeOpacity={0.5}
                                style={[GlobalStyleSheet.background3, {}]}
                            >
                                <Image
                                   style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.card : '#5F5F5F'}]}
                                    source={IMAGES.Notification} 
                                />
                                <View 
                                    style={[styles.notifactioncricle,{
                                        backgroundColor:colors.card,
                                    }]}
                                >
                                    <View
                                        style={{
                                            height:13,
                                            width:13,
                                            borderRadius:13,
                                            backgroundColor:COLORS.primary
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                //onPress={() => navigation.openDrawer()}
                                onPress={() => dispatch(openDrawer())}
                                style={[GlobalStyleSheet.background3, {}]}
                            >
                                <Image
                                    style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.card : '#5F5F5F'}]}
                                    source={IMAGES.grid6} 
                                />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container,{padding:0,paddingHorizontal:30,paddingTop:15}]}>
                    {/* <View>
                        <TextInput
                            placeholder='Qual a Busca de Hoje'
                            style={[styles.TextInput, { color: COLORS.title,backgroundColor:'#FAFAFA' }]}
                            placeholderTextColor={'#929292'} />
                        <View style={{ position: 'absolute', top: 15, right: 20 }}>
                            <Feather name='search' size={24} color={'#C9C9C9'} />
                        </View>
                    </View> */}
                </View>
                <View style={{alignItems:'center'}}>
                    <View style={[GlobalStyleSheet.container,{padding:0,}]}>
                        <ImageSwiper
                            data={SwiperData}
                        />
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingTop:0}]}>
                    <View style={[GlobalStyleSheet.flex,{paddingHorizontal:30}]}>
                        <Text style={[styles.brandsubtitle3,{fontSize: 18,color:colors.title}]}>Categorias</Text>
                    </View>
                    <View style={{ marginHorizontal: -15, paddingHorizontal: 15, paddingTop: 25 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 30 }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginRight: 10,marginBottom:20 }}>
                                {ArrivalData.map((data: any, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => setIsShowDevelopment(true)}
                                            key={index}
                                            style={[styles.arrivaldata,{
                                                backgroundColor:theme.dark ? colors.background :colors.card,
                                                borderColor:'#EFEFEF',
                                                shadowColor: "rgba(4,118,78,.6)",
                                            }]}>
                                            <View style={[GlobalStyleSheet.flexcenter,{gap:20,justifyContent:'flex-start'}]}>
                                                <Image
                                                    style={[GlobalStyleSheet.image3]}
                                                    source={data.image}
                                                    tintColor={`#2f2f2f`}                                                />
                                                <View>
                                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color:  colors.title }}>{data.title}</Text>
                                                    <Text style={{ ...FONTS.fontRegular, fontSize: 14, color:COLORS.primary }}>{data.subtitle}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
                {/* <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 10 }]}>
                    <View style={[GlobalStyleSheet.flex, { paddingHorizontal: 30 }]}>
                        <Text style={[styles.brandsubtitle3, { fontSize: 18, color: colors.title }]}>Featured Beverages</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Products')}
                        >
                            <Text style={[styles.brandsubtitle3, { fontSize: 16, color:COLORS.primary }]}>More</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                {/* <View style={[GlobalStyleSheet.container,{paddingHorizontal:30}]}>
                    {CardStyleData.map((data:any, index:any) => {
                        return (
                            <View key={index} style={{marginBottom:40}}>
                                <Cardstyle4
                                    id={data.id}
                                    image={data.image}
                                    price={data.price}
                                    countnumber={data.countnumber} 
                                    title={data.title}
                                    onPress={() => navigation.navigate('ProductsDetails')}                                        
                                    onPress5={() => addItemToWishList(data)}                                
                                />
                            </View>
                        );
                    })}
                </View> */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
        notifactioncricle:{
            height:16,
            width:16,
            borderRadius:16,
            backgroundColor:COLORS.card,
            alignItems:'center',
            justifyContent:'center',
            position:'absolute',
            top:2,
            right:2
        },
        flex:{
            flexDirection:'row',
            alignItems:'flex-start',
            justifyContent:'center'
        },
        TextInput:{
            ...FONTS.fontRegular,
            fontSize:16,
            color:COLORS.title,
            height:60,
            borderRadius:61,
            paddingHorizontal:40,
            paddingLeft:30,
            borderWidth:1,
            borderColor:'#EBEBEB',
            backgroundColor:'#FAFAFA'
        },
        brandsubtitle2:{
            ...FONTS.fontSemiBold,
            fontSize:12,
            color:COLORS.card
        },
        brandsubtitle3:{
            ...FONTS.fontMedium,
            fontSize:12,
            color:COLORS.title
        },
        title1:{
            ...FONTS.fontBold,
            fontSize:28,
            color:COLORS.title,
        },
        title2:{
            ...FONTS.fontRegular,
            fontSize:12,
            color:COLORS.title,
        },
        title3:{
            ...FONTS.fontSemiBold,
            fontSize:24,
            color:'#8ABE12',
            //textAlign:'right'
        },
        colorCard:{
            
        },
        colorCardTitle:{
            ...FONTS.fontMedium,
            fontSize:12,
            color:COLORS.title,
            lineHeight:20,
            textAlign:'center'
        },
        arrivaldata:{
            backgroundColor:COLORS.card,
            borderRadius: 18,
            width:199,
            paddingHorizontal: 10,
            paddingLeft:25,
            paddingVertical: 15,
            borderWidth:1,
            borderColor:'#EFEFEF',
            shadowColor: "rgba(4,118,78,.6)",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.34,
            shadowRadius: 18.27,
            elevation: 4, 
        },
        wave1: {
            height: 200,
            borderBottomLeftRadius: 50, // Arredonda para criar o efeito de onda
            borderBottomRightRadius: 50,
            transform: [{ rotate: '-15deg' }],
        },
        wave2: {
            height: 150,
            borderTopLeftRadius: 100,
            borderTopRightRadius: 100,
            marginTop: -50, // Sobreposição para criar profundidade
            transform: [{ rotate: '10deg' }],
        },
})
