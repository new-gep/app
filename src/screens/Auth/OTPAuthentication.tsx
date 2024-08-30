import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StatusBar, StyleSheet, ActivityIndicator, } from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import { IMAGES } from '../../constants/Images'
import Button from '../../components/Button/Button'
import OTPInput from '../../components/Input/OTPInput'
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FormValues } from '../../utils/validateField'


type OTPAuthenticationScreenProps = StackScreenProps<RootStackParamList, 'OTPAuthentication'>;

const OTPAuthentication = ({navigation} : OTPAuthenticationScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors : any} = theme;
    const [reset, setReset] = useState(false);
    const [otpCode, setOTPCode] = useState("");
    const [isPinReady, setIsPinReady] = useState(false);
    const maximumCodeLength = 4;
    const [waitProcess, setWaitProcess] = useState(false);
    const [formValues, setFormValues]  = useState<FormValues>({
        email: '',
        cpf  : '',
    });
    const resetComponent = () => {
        setReset(true);
        setTimeout(() => {
            setReset(false); // Força a recriação do componente
        }, 0);
    };

    const checkCollaborator = async () => {
        let collaboratorDates = await AsyncStorage.getItem('datesForgotPassword');  
        if(collaboratorDates){
            const collaborator = JSON.parse(collaboratorDates) ;
            formValues.cpf     = collaborator.cpf
            formValues.email   = collaborator.email
        }
        console.log(collaboratorDates)
        setWaitProcess(true)
        return
    };


    useEffect(()=>{
        checkCollaborator()
        // checkCode()
    },[otpCode])

  return (
    <SafeAreaView style={{flex:1,backgroundColor: colors.card,}}>
        {!waitProcess ?
            <>
                <View className={`h-full w-full items-center justify-center gap-1`}>
                    <View className={`h-20 w-full `}>
                        <Image
                            style={{top:'-120%', left:'20%'}}
                            className={`h-60 w-60 absolute`}
                            source={theme.dark ? IMAGES.appnamedark :IMAGES.appname}
                        />
                    </View>
                    <ActivityIndicator
                        color={'#1f2937'}
                    />
                    <Text className={`text-xs font-semibold`}>
                        Resgatando dados de recuperação
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
                                    <View>
                                        {reset ? null : (
                                                <OTPInput
                                                    code={otpCode}
                                                    setCode={setOTPCode}
                                                    maximumLength={maximumCodeLength}
                                                    setIsPinReady={setIsPinReady}
                                                />
                                        )}
                                    </View>
                                </View> 
                            </View>
                            <Text style={[styles.title2,{color:colors.title,textAlign:'center'}]}>Se você não recebeu o código {"\n"}
                                <Text style={{...FONTS.fontMedium,textDecorationLine:'underline',color:COLORS.primary}}>Reenviar</Text>
                            </Text>
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
                                <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title}]}>Voltar para</Text>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('SingIn')}>
                                    <Text style={styles.title4}>Acesso</Text>
                                </TouchableOpacity>
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

export default OTPAuthentication