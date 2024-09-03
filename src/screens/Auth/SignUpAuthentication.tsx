import React, { useEffect, useRef, useState } from 'react'
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
import RBSheet from 'react-native-raw-bottom-sheet'
import DangerSheet from '../../components/BottomSheet/DangerSheet'
import SendCodeByEmail from '../../hooks/utils/SendCodeByEmail'
import SuccessSheet from '../../components/BottomSheet/SuccessSheet'
import CreateCollaborator from '../../hooks/create/collaborator'
type SignUpAuthenticationNavigationProp = NavigationProp<RootStackParamList, 'SignUpAuthentication'>;
interface Props { email: string }
const SignUpAuthentication = () => {
    const navigation = useNavigation<SignUpAuthenticationNavigationProp>();
    const theme = useTheme();
    const refRBSheet = useRef<any>(null);
    // activeSheet
    const { colors }: { colors : any} = theme;
    const [otpCode, setOTPCode] = useState("");
    const [isPinReady, setIsPinReady] = useState(false);
    const [waitProcess, setWaitProcess] = useState(false);
    const [waitProcessResend, setWaitProcessResend] = useState(false);
    const [activeSheet, setActiveSheet]   = useState(String);
    const [messageSheet, setMessageSheet] = useState(String);
    const [reset, setReset] = useState(false);
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
            formValues.checkCode = collaborator.checkCode
            formValues.password = collaborator.password
            formValues.repeatPassword = collaborator.repeatPassword 
        }
        setWaitProcess(true)
        return
    };

    const checkCode = async () => {
        if(otpCode.length == 4){
            if(formValues.checkCode == otpCode){
                const response = await CreateCollaborator(formValues)
                switch (response.status) {
                    case 201:
                        await AsyncStorage.removeItem('checkCollaborator');
                        await AsyncStorage.setItem('collaboratorCreateSuccess', 'success');
                        navigation.navigate('SingIn')
                        break;
                    case 409:
                        setActiveSheet('danger')
                        setMessageSheet(response.message)
                        setOTPCode('')
                        Sheet()
                        resetComponent()
                        break;
                    default:
                        setActiveSheet('danger')
                        setMessageSheet(' Algo deu errado, tente mais tarde.')
                        setOTPCode('')
                        Sheet()
                        resetComponent()
                        break;
                }
            }else{
                setActiveSheet('danger')
                setMessageSheet('Código incorreto')
                setOTPCode('')
                Sheet()
                resetComponent()
            }
        }
    };

    const resetComponent = () => {
        setReset(true);
        setTimeout(() => {
            setReset(false); // Força a recriação do componente
        }, 0);
    };

    const handleResendCode = async () => {
        setWaitProcessResend(true)
        let email = formValues.email;
        if (email && !waitProcessResend) {
            const props: Props = { email };  
            const response = await SendCodeByEmail(props); 
            switch (response.status) {
                case 200:
                    const updatedFormValues = { ...formValues, checkCode: response.code };
                    await AsyncStorage.setItem('checkCollaborator', JSON.stringify(updatedFormValues));
                    setActiveSheet('success')
                    setMessageSheet('Código enviado.')
                    checkCollaborator()
                    Sheet()
                    break;
                default:
                    setActiveSheet('danger')
                    setMessageSheet(' Algo deu errado, tente mais tarde..')
                    Sheet()
                    break;
            }
            setWaitProcessResend(false)
        }
    };

    const Sheet = async () => {
        await refRBSheet.current.open();
    };

    useEffect(()=>{
        checkCollaborator()
        checkCode()
    },[otpCode])

  return (
    <SafeAreaView style={{flex:1,backgroundColor: colors.card,}}>
        <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            height={215}
            openDuration={100}
            customStyles={{
                container: {
                    backgroundColor: theme.dark ? colors.background : colors.cardBg,
                },
                draggableIcon: {
                    marginTop: 10,
                    marginBottom: 5,
                    height: 5,
                    width: 80,
                    backgroundColor: colors.border,
                }
            }}
        >

            { activeSheet === "success" ?
                <SuccessSheet message={messageSheet} />
                :
                <DangerSheet message={messageSheet} />
            }
        </RBSheet>
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
                            <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title,textAlign:'center'}]}>Um código de verificação foi enviado{"\n"} {formValues.email} </Text>
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
                            <Text style={[styles.title2,{color:colors.title,textAlign:'center'}]}>Se você não recebeu o código {"\n"} 
                                <TouchableOpacity 
                                    onPress={handleResendCode}
                                >
                                    <Text style={{...FONTS.fontMedium,textDecorationLine:'underline',color:COLORS.primary}}>
                                        { waitProcessResend ?
                                            <ActivityIndicator
                                                color={'#fde047'}
                                            />
                                            :
                                            'Reenviar'
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </Text>
                        </ScrollView>
                        <View style={{marginBottom:10}}>
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