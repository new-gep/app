import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StatusBar, StyleSheet, ActivityIndicator} from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { NavigationProp, useTheme } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import { IMAGES } from '../../constants/Images'
import Button from '../../components/Button/Button'
import OTPInput from '../../components/Input/OTPInput'
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormValues } from '../../utils/validateField'

type SignUpAuthenticationNavigationProp = NavigationProp<RootStackParamList, 'SignUpAuthentication'>;

const SignUpAuthentication = () => {
    const navigation = useNavigation<SignUpAuthenticationNavigationProp>();
    const theme = useTheme();
    const { colors }: { colors : any} = theme;
    const [otpCode, setOTPCode] = useState("");
    const [isPinReady, setIsPinReady] = useState(false);
    const [waitProcess, setWaitProcess] = useState(false);
    const maximumCodeLength = 4;
    const [formValues, setFormValues]  = useState<FormValues>({
        name : '',
        email: '',
        cpf  : '',
        phone: '',
        password: '',
        checkCode:''
    });

    const checkCollaborator = async () => {
        let collaboratorDates = await AsyncStorage.getItem('checkCollaborator');  
        if(collaboratorDates){
            const collaborator = JSON.parse(collaboratorDates) ;
            formValues.name    = collaborator.name 
            formValues.cpf     = collaborator.cpf
            formValues.email   = collaborator.email
            formValues.phone   = collaborator.phone
            formValues.password = collaborator.password
            formValues.repeatPassword = collaborator.repeatPassword 
        }
        setWaitProcess(true)
        return
    }

    useEffect(()=>{
        checkCollaborator()
    })

    useEffect(()=>{

    })

  return (
    <SafeAreaView style={{flex:1,backgroundColor: colors.card,}}>
        { !waitProcess ?
            <>
                <View className={`h-full w-full items-center justify-center gap-1`}>
                    <ActivityIndicator
                        color={'#1f2937'}
                    />
                    <Text className={`text-xs font-semibold`}>
                        Resgatando dados de cadastro
                    </Text>
                </View>
            </>
        :
            <>
                <View className={`px-10`} style={[GlobalStyleSheet.container,GlobalStyleSheet.flexcenter,{paddingVertical:50}]}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                        activeOpacity={0.5}
                        style={[styles.imagebackground,{
                            backgroundColor:'#F6F6F6',
                            zIndex:99
                        }]}
                    >
                        <Feather name='arrow-left' size={24} color={COLORS.title}/>
                    </TouchableOpacity>
                    <View className={`h-20 w-full `}>
                        <Image
                            style={{top:'-95%', left:'6%'}}
                            className={`h-60 w-60 absolute`}
                            source={theme.dark ? IMAGES.appnamedark :IMAGES.appname}
                        />
                    </View>
                </View>
                <View style={{flex:1}}>
                    <View style={[GlobalStyleSheet.container,{flexGrow:1,paddingHorizontal:30,paddingBottom:0}]}>
                        <ScrollView>
                            <Text style={[styles.title1,{color:colors.title,textAlign:'center'}]}>Digite o Código</Text>
                            <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title,textAlign:'center'}]}>Um código de verificação foi enviado{"\n"}{formValues.email}</Text>
                            <View>
                                <View style={{marginBottom:20}}>
                                <OTPInput
                                        code={otpCode}
                                        setCode={setOTPCode}
                                        maximumLength={maximumCodeLength}
                                        setIsPinReady={setIsPinReady}
                                />
                                {/* <StatusBar barStyle={'light-content'}/> */}
                                </View> 
                            </View>
                            <Text style={[styles.title2,{color:colors.title,textAlign:'center'}]}>Se você não recebeu o código {"\n"} <Text style={{...FONTS.fontMedium,textDecorationLine:'underline',color:COLORS.primary}}>Reenviar</Text></Text>
                        </ScrollView>
                        <View style={{marginBottom:10}}>
                            <View style={{}}>
                                <Button
                                    title={"Verify and proceed"}
                                    onPress={() => navigation.navigate('NewPassword')}
                                    style={{borderRadius:48}}
                                />
                            </View>
                            <View style={[GlobalStyleSheet.bottombtn]}>
                                <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title}]}>New Gep</Text>
                                <Text style={styles.title4}>technology</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </>
        }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    imagebackground:{
        height:46,
        width:46,
        borderRadius:50,
        backgroundColor:'#F6F6F6',
        alignItems:'center',
        justifyContent:'center',
    },
    text:{
        ...FONTS.fontRegular,
        fontSize:16,
        color:COLORS.primary,
        textDecorationLine:'underline'
    },
    title1:{
            ...FONTS.fontSemiBold,
            fontSize: 24,
            color: COLORS.title,
            marginBottom: 5 
    },
    title2:{
        ...FONTS.fontRegular,
        fontSize: 14,
            color: COLORS.text 
    },
    title4:{
        ...FONTS.fontRegular,
        fontSize:14,
        color:COLORS.primary,
        textDecorationLine:'underline',
        textDecorationColor:COLORS.primary
    },

})

export default SignUpAuthentication