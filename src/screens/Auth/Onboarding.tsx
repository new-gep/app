import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, ScrollView,Animated, Platform, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IMAGES } from '../../constants/Images';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { COLORS,FONTS, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Button from '../../components/Button/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA = [
    {
        title: "Descomplicando sua contratação",
        subtitle:" Aqui, transformamos todo o processo em uma experiência simples e eficiente, menos burocracia, mais resultados. Vamos juntos?"
    },
    {
        title: "Sua Jornada, Nossa Missão",
        subtitle:"Acompanhe sua trajetória e metas com clareza. Estamos ao seu lado em cada passo."
    },
    {
        title: "Eficiência com Transparência",
        subtitle:"Ganhe tempo com transparência e objetividade! Aqui, tudo é claro e direto, para que você tenha as informações que precisa de forma rápida e sem rodeios."
    },
]

type OnboardingScreenProps = StackScreenProps<RootStackParamList, 'Onboarding'>;

const Onboarding = ({navigation} : OnboardingScreenProps) => {

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    const IndexData = ["01","02","03"]

    const IndexImage =[IMAGES.onborder5,IMAGES.onborder3,IMAGES.onborder4]

    const scrollRef = useRef<any>();

    const scrollX = useRef(new Animated.Value(0)).current;

    const [sliderIndex , setSliderIndex] = useState<any>(1);
    const [waitProcess , setWaitProcess] = useState(false);

    const onScroll = (event: any) => {
        scrollX.setValue(event.nativeEvent.contentOffset.x);
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        setSliderIndex(Math.round(contentOffsetX / SIZES.width) + 1);
    };

    const scrollToIndex = (index: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: index * SIZES.width, animated: true });
        }
    };

    const checkCollaborator = async () => {
        const checkCollaborator = await AsyncStorage.getItem('checkCollaborator');
        const rememberMy        = await AsyncStorage.getItem('rememberMy');


        if(checkCollaborator){
            setWaitProcess(true)
            navigation.navigate('SignUpAuthentication')
            return
        };
        if(rememberMy){
            setWaitProcess(true)
            navigation.navigate('DrawerNavigation',{screen : 'Home'} )
            return
        };
        setWaitProcess(true);
    };

    const [imageScale] = useState(new Animated.Value(0));

    useEffect(() => {
        console.log("sliderIndex", sliderIndex)
        // setWaitProcess(true)
        checkCollaborator();
        Animated.sequence([
            Animated.timing(imageScale, {
                toValue: 0, // Scale up to 0
                duration: 100, // Animation duration
                useNativeDriver: true, // Add this line for better performance
            }),
            Animated.timing(imageScale, {
                toValue: 1, // Scale back to 1
                duration: 300, // Animation duration
                useNativeDriver: true, // Add this line for better performance
            }),
        ]).start();
    }, [sliderIndex]);
    
  return (
    <SafeAreaView style={{flex:1,backgroundColor: colors.card}}>
        { !waitProcess ?
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View className={`h-full w-full items-center justify-center`}>
                    <Image
                        className='h-full w-full'
                        source={theme.dark ? IMAGES.appnamedark :IMAGES.appname}
                    />
                </View>
                <ActivityIndicator
                    size={20}
                    color={'#1f2937'}
                    className={'absolute'}
                    style={{top:'68%', left:'48%'}}
                />
            </ScrollView>
            :
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={{flex:1}}>
                    <View style={[GlobalStyleSheet.container,{marginTop:160,padding:0,flex:1}]}>
                        <Animated.View
                            style={{
                                transform: [{ scale: imageScale }], // Apply scale transform
                            }}
                        >
                            <Image
                                style={styles.image2}
                                source={IndexImage[sliderIndex-1]}
                            />
                        </Animated.View>
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0,marginBottom:55}]}>
                        <ScrollView
                            ref={scrollRef}
                            horizontal
                            pagingEnabled
                            scrollEventThrottle={16}
                            decelerationRate="fast"
                            showsHorizontalScrollIndicator={false}
                            onScroll={onScroll}
                        >
                            {DATA.map((data:any, index) => (
                                <View style={[styles.slideItem,Platform.OS === "ios" && {
                                    // paddingBottom:35
                                }]} key={index}>
                                    <View style={{paddingHorizontal:30 }}>
                                        <Text style={[styles.title1,{color:colors.title},Platform.OS === 'web' && {textAlign:'center'}]}>{data.title}</Text>
                                        <Text style={[styles.title2,{color:colors.text},Platform.OS === 'web' && {textAlign:'center'}]}>{data.subtitle}</Text>
                                    </View>
                                </View>
                                ))
                            }
                        </ScrollView>
                        <View style={[styles.indicatorConatiner,Platform.OS === "ios" && { 
                            bottom:0
                        }]} pointerEvents="none">
                            {DATA.map((x:any, i:any) => (
                                <Indicator i={i} key={i} scrollValue={scrollX} />
                            ))}
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{padding:0,paddingHorizontal:30,paddingBottom:30}]}>
                    <Button
                        style={{ borderRadius:52}}
                        bg='bg-[#000000]'
                        title="Vamos começar"
                        onPress={() => navigation.navigate('SingIn')} 
                    />
                </View>
            </ScrollView>
            
        }
    </SafeAreaView>
  )
}

function Indicator({ i, scrollValue } : any) {
    
    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    const translateX = scrollValue.interpolate({
        inputRange: [-SIZES.width + i * SIZES.width, i * SIZES.width, SIZES.width + i * SIZES.width],
        outputRange: [-20, 0, 20],
    });
    return (
        <View style={[styles.indicator, { backgroundColor:theme.dark ? 'rgba(255,255,255,0.20)':'rgba(0, 0, 0, 0.20)', borderColor:theme.dark ? 'rgba(255,255,255,0.20)':'rgba(0, 0, 0, 0.20)' }]}>
            <Animated.View
                style={[styles.activeIndicator, { transform: [{ translateX }], backgroundColor:COLORS.primary }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    indicatorConatiner: {
        alignSelf:'center',
        flexDirection: 'row',
        top:25,
    },
    indicator: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        borderWidth: 1,
        overflow: 'hidden',
    },
    activeIndicator: {
        height:'100%',
        width:'100%',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    },
    slideItem: {
        width: SIZES.width,
        //paddingBottom: 10,    
    },
    text:{
        ...FONTS.fontLight,
        fontSize:14,
        color:COLORS.title,
        textDecorationLine:'underline'
    },
    image2:{
        width:'100%',
        height:undefined,
        aspectRatio:1/.6,
       //position:'absolute',
        left:0,
        right:0,
        top:0,
        resizeMode:'contain',
        //backgroundColor:COLORS.primary
        //bottom:0,
    },
    title1:{
        ...FONTS.fontSemiBold,
        fontSize:24,
        textAlign:'center',
        color:COLORS.title,
        //paddingHorizontal:30
    },
    title2:{
        ...FONTS.fontRegular,
        fontSize:14,
        textAlign:'center',
        color:COLORS.text,
        paddingHorizontal:10,
        marginTop:5
    },
})

export default Onboarding