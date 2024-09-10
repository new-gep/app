import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { COLORS, FONTS } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import Input from '../../components/Input/Input'
import { IMAGES } from '../../constants/Images'
import Button from '../../components/Button/Button'
import RBSheet from 'react-native-raw-bottom-sheet'
import DangerSheet from '../../components/BottomSheet/DangerSheet'
import { FormValues, validateForm } from '../../function/validateField'
import FindCollaborator from '../../hooks/findOne/collaborator'
import SendCodeByEmail from '../../hooks/utils/SendCodeByEmail'
import AsyncStorage from '@react-native-async-storage/async-storage'
type ForgotPasswordScreenProps = StackScreenProps<RootStackParamList, 'ForgotPassword'>;
interface Props { email: string }
const ForgotPassword = ({navigation} :ForgotPasswordScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors : any} = theme;
    const [isFocused , setisFocused] = useState(false);
    const [messageSheet, setMessageSheet] = useState(String);
    const [waitProcess, setWaitProcess]   = useState(false);
    const refRBSheet = useRef<any>(null);
    const [formValues, setFormValues]  = useState<FormValues>({
        cpf  : '',
    });

    
    const Sheet = async () => {
        await refRBSheet.current.open();
    };

    const handleSendCode = async () => {
        if(waitProcess){
            return
        }
        setWaitProcess(true)
        const validationErrors = await validateForm(formValues);
        if (Object.keys(validationErrors).length !== 0) {
            const firstErrorMessage = Object.values(validationErrors)[0];
            setMessageSheet(firstErrorMessage)
            Sheet()
            setWaitProcess(false)
            return
        };
        const dates = await FindCollaborator(formValues);
        switch (dates.status) {
                case 200:
                    let email = dates.collaborator.email
                    if(email){
                        const props: Props = { email };  
                        const response = await SendCodeByEmail(props); 
                        switch (response.status) {
                            case 200:
                                const collaborator = {
                                    code : response.code,
                                    email: dates.collaborator.email,
                                    cpf  : dates.collaborator.CPF
                                }
                                await AsyncStorage.setItem('datesForgotPassword',  JSON.stringify(collaborator));
                                navigation.navigate('OTPAuthentication')
                                setWaitProcess(false)
                                return
                            default:
                                setMessageSheet(` Algo deu errado, tente mais tarde.`)
                                Sheet()
                                setWaitProcess(false)
                                return
                        }
                    }
                    setMessageSheet('Algo deu errado, tente mais tarde.')
                    Sheet()
                    setWaitProcess(false)
                    break;
                case 409:
                    setMessageSheet(dates.message)
                    Sheet()
                    setWaitProcess(false)
                    break;
                default:
                    setMessageSheet(` Algo deu errado, tente mais tarde.`)
                    Sheet()
                    setWaitProcess(false)
                    break;
        }
        setWaitProcess(false)
        
    }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.card,}}>
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

            <DangerSheet  message={messageSheet} />
        </RBSheet>
        <View className={`items-center px-8 flex-row py-12 `}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.5}
                style={[styles.imagebackground,{
                    backgroundColor:'#F6F6F6',
                    zIndex:99
                }]}
            >
                <Feather name='arrow-left' size={24} color={COLORS.title}/>
            </TouchableOpacity>
            <View className='justify-center items-center h-20'>
                <Image
                    className='h-60 w-60'
                    resizeMode='contain'
                    source={theme.dark ? IMAGES.appnamedark :IMAGES.appname}
                />
            </View>
        </View>
        <ScrollView style={{flexGrow:1,}} showsVerticalScrollIndicator={false}>
            <View style={[GlobalStyleSheet.container,{flexGrow:1,paddingBottom:0,paddingHorizontal:30,paddingTop:0}]}>
                <View style={{}}>
                    <View style={{marginBottom:30}}>
                        <Text style={[styles.title1,{color:colors.title}]}>Recuperar a Senha</Text>
                        <Text style={[styles.title2, {color: colors.title }]}>Digite seu CPF e enviaremos um código para o e-mail cadastrado</Text>
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>CPF</Text>
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Input
                            prop_mask={'cpf'}
                            keyboardType={'numeric'}
                            value={formValues.cpf}
                            onChangeText={(masked, unmasked) => setFormValues({ ...formValues, cpf: unmasked })}
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            isFocused={isFocused}
                            inputBorder
                            
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
        <View style={[GlobalStyleSheet.container,{paddingTop:0,paddingHorizontal:30}]}>
            <Button
                load={waitProcess}
                loadSize={20}
                loadColor={'#FFFFFF'}
                title={"Enviar E-mail"}
                color={COLORS.dark}
                onPress={handleSendCode} 
                style={{borderRadius:52}}
            />
           <View style={[GlobalStyleSheet.bottombtn]}>
                <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title}]}>Voltar para</Text>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('SingIn')}>
                    <Text style={styles.title4}>Acesso</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    title1:{
        ...FONTS.fontSemiBold,
         fontSize: 24,
        color: COLORS.title,
        marginBottom: 5 
    },
    title2:{
        ...FONTS.fontRegular,
        fontSize: 14,
        color: COLORS.title, 
    },
    title3:{
        ...FONTS.fontMedium,
        fontSize:14,
        color:'#8A8A8A'
    },
    title4:{
        ...FONTS.fontRegular,
        fontSize:14,
        color:COLORS.primary,
        textDecorationLine:'underline',
        textDecorationColor:'#8ABE12'
    },
    imagebackground:{
        height:46,
        width:46,
        borderRadius:50,
        backgroundColor:'#F6F6F6',
        alignItems:'center',
        justifyContent:'center',
    }
})

export default ForgotPassword