import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import Input from '../../components/Input/Input'
import { IMAGES } from '../../constants/Images'
import Button from '../../components/Button/Button'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import DangerSheet from '../../components/BottomSheet/DangerSheet'
import CheckCollaborator from '../../hooks/utils/checkCollaborator'
import RBSheet from 'react-native-raw-bottom-sheet'
import { FormValues, validateForm } from '../../utils/validateField'
import AsyncStorage from '@react-native-async-storage/async-storage';
type SignUpScreenProps = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({navigation} : SignUpScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors : any} = theme;
    const refRBSheet = useRef<any>(null);
    const [message  , setMessage]       = useState(String);
    const [isFocused  , setisFocused]   = useState(false);
    const [isFocused1  , setisFocused1] = useState(false);
    const [isFocused2 , setisFocused2] = useState(false);
    const [isFocused3 , setisFocused3] = useState(false);
    const [isFocused4 , setisFocused4] = useState(false);
    const [isFocused5 , setisFocused5] = useState(false);
    const [load       , setLoad]       = useState(false);
    const [waitProcess, setWaitProcess] = useState(false);
    const [formValues, setFormValues]  = useState<FormValues>({
        name : '',
        email: '',
        cpf  : '',
        phone: '',
        password: '',
        repeatPassword: '',
        terms: false,
        checkCode:''
    });

    const Sheet = async () => {
        await refRBSheet.current.open();
    }

    const handleCreateAccount = async () => {
        if(load){
            return
        }
        setLoad(true)
        const validationErrors = await validateForm(formValues);
        if (Object.keys(validationErrors).length !== 0) {
            const firstErrorMessage = Object.values(validationErrors)[0];
            setMessage(firstErrorMessage)
            Sheet()
            return
        };
        const response = await CheckCollaborator(formValues);
        switch (response.status) {
            case 200:
                setFormValues({ ...formValues, checkCode: response.code })
                await AsyncStorage.setItem('checkCollaborator', JSON.stringify(formValues));
                navigation.navigate('SignUpAuthentication')
                setLoad(false)
                break;
            case 409:
                setMessage(response.message)
                Sheet()
                setLoad(false)
                break
            default:
                setMessage('Tente mais tarde')
                Sheet()
                setLoad(false)
                break;
        }
    }

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
            <DangerSheet message={message} />
        </RBSheet>
        <View className={`px-10 py-5 h-40 flex-row justify-center items-center`}>
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
            <View className={`h-60`} style={{flex:1,alignItems:'center',marginLeft:-40,}}>
                <Image
                    className='h-full w-full'
                    resizeMode='contain'
                    source={theme.dark ? IMAGES.appnamedark :IMAGES.appname}
                />
            </View>
        </View>
        {   !waitProcess ?
            <ScrollView style={{flex:1}}>
                <View style={{marginTop:'60%'}} className={`items-center justify-center w-full text-center gap-2`}>
                    <ActivityIndicator
                        color={'#1f2937'}
                    />
                    <Text className={`text-xs font-semibold`}>
                        Resgatando dados de cadastro
                    </Text>
                </View>
            </ScrollView>
            :
            <ScrollView style={{flexGrow:1,}} showsVerticalScrollIndicator={false}>
            <View style={[GlobalStyleSheet.container,{flexGrow:1,paddingBottom:0,paddingHorizontal:30,paddingTop:0}]}>
                <View style={{}}>
                    <View style={{marginBottom:30}}>
                        <Text style={[styles.title1,{color:colors.title}]}>Criar conta</Text>
                        <Text style={[styles.title2, {color: colors.title }]}>Crie uma conta de maneira ágil e segura. Gerencie informações e processos de forma eficiente, com total transparência e controle.</Text>
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>Nome completo</Text>
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Input
                            classStyles='capitalize'
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            value={formValues.name }
                            onChangeText={(value) => setFormValues({ ...formValues, name: value })}
                            isFocused={isFocused}
                            inputBorder
                        />
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>CPF</Text>
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Input
                            prop_mask={'cpf'}
                            keyboardType={'numeric'}
                            onFocus={() => setisFocused1(true)}
                            onBlur={() => setisFocused1(false)}
                            value={formValues.cpf}
                            onChangeText={(masked, unmasked) => setFormValues({ ...formValues, cpf: unmasked })}
                            isFocused={isFocused1}
                            inputBorder
                        />
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>Celular</Text>
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Input
                            prop_mask={'phone'}
                            keyboardType={'numeric'}
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            value={formValues.phone }
                            onChangeText={(masked, unmasked) => setFormValues({ ...formValues, phone: unmasked })}
                            isFocused={isFocused2}
                            inputBorder
                        />
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>Email</Text>
                    </View>
                    <View style={{ marginBottom: 20,marginTop:10 }}>
                        <Input
                            onFocus={() => setisFocused3(true)}
                            onBlur={() => setisFocused3(false)}
                            backround={colors.card}
                            value={formValues.email }
                            onChangeText={(value) => setFormValues({ ...formValues, email: value })}
                            isFocused={isFocused3}
                            inputBorder
                        />
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>Senha</Text>
                    </View>
                    <View style={{ marginBottom: 10,marginTop:10 }}>
                        <Input
                            onFocus={() => setisFocused4(true)}
                            onBlur={() => setisFocused4(false)}
                            backround={colors.card}
                            value={formValues.password }
                            onChangeText={(value) => setFormValues({ ...formValues, password: value })}
                            isFocused={isFocused4}
                            type={'password'}
                            inputBorder
                        />
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>Repetir senha</Text>
                    </View>
                    <View style={{ marginBottom: 10,marginTop:10 }}>
                        <Input
                            onFocus={() => setisFocused5(true)}
                            onBlur={() => setisFocused5(false)}
                            backround={colors.card}
                            value={formValues.repeatPassword }
                            onChangeText={(value) => setFormValues({ ...formValues, repeatPassword: value })}
                            isFocused={isFocused5}
                            type={'password'}
                            inputBorder
                        />
                    </View>
                </View>
                <View className={'flex-row py-3'}>
                    <View className='w-5'>
                        <BouncyCheckbox
                            size={20}
                            fillColor="#fde047"
                            unfillColor="#f4f4f4"
                            iconStyle={{ borderColor: "#fde047" }}
                            // innerIconStyle={{ borderWidth: 1 }}
                            onPress={()=>setFormValues({ ...formValues, terms: !formValues.terms })}
                        />
                    </View>
                    <Text className={'px-1'}>Li e concordo com os</Text>
                    <Text className={'text-terciary font-bold'} >Termos de uso</Text>
                </View>
                <View className={'mb-10'} style={{marginTop:30}}>
                    <Button
                        title={"Criar conta"}
                        color={'#606060'}
                        load={load}
                        loadSize={20}
                        loadColor={'#FFFFFF'}
                        // bg={'bg-primary'}
                        // onPress={() => navigation.navigate('SingIn')}
                        onPress={handleCreateAccount}
                        style={{borderRadius:52}}
                    />
                </View>
            </View>
            </ScrollView>
        }
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
    imagebackground:{
        height:46,
        width:46,
        borderRadius:50,
        backgroundColor:'#F6F6F6',
        alignItems:'center',
        justifyContent:'center',
    }
})

export default SignUp