import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import Input from '../../components/Input/Input'
import { IMAGES } from '../../constants/Images'
import Button from '../../components/Button/Button'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RBSheet from 'react-native-raw-bottom-sheet';
import SuccessSheet from '../../components/BottomSheet/SuccessSheet';
import DangerSheet from '../../components/BottomSheet/DangerSheet';
import { useFocusEffect } from '@react-navigation/native';
import AuthASingIn from '../../hooks/utils/authAccessCollaborator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SingInScreenProps = StackScreenProps<RootStackParamList, 'SingIn'>;
type Props = {
    cpf     :string
    password:string
 }
const SingIn = ({route, navigation} : SingInScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors : any} = theme;
    const [isFocused , setisFocused] = useState(false);
    const [isFocused2 , setisFocused2] = useState(false);
    const [cpf , setCpf] = useState<any>('');
    const [password , setpassword] = useState(String);
    const [activeSheet, setActiveSheet]   = useState(String);
    const [waitProcessSingIn, setWaitProcessSingIn] = useState(false);
    const [remember, setRemember] = useState(true)
    const [messageSheet, setMessageSheet] = useState(String);
    const refRBSheet = useRef<any>(null);

    const handleFocus = useCallback( () => {
       const searchRegister = async () => {
           const newCollaborator         = await AsyncStorage.getItem('collaboratorCreateSuccess');
           const newCollaboratorPassword = await AsyncStorage.getItem('collaboratorCreateNewPasswordSuccess');
            if(newCollaborator){
                await AsyncStorage.removeItem('collaboratorCreateSuccess');
                setActiveSheet('success')
                setMessageSheet('Conta criada, parabéns')
                Sheet()
            };
            if(newCollaboratorPassword){
                await AsyncStorage.removeItem('collaboratorCreateNewPasswordSuccess');
                setActiveSheet('success')
                setMessageSheet('Senha alterada, parabéns')
                Sheet()
            };
        };
       searchRegister();
    }, []);
    
    const Sheet = async () => {
        await refRBSheet.current.open();
    };

    const handleSingIn = async () => {
        if(waitProcessSingIn){
            return
        }
        setWaitProcessSingIn(true)
        const props: Props = { cpf, password };
        const response = await AuthASingIn(props)
        switch (response.status) {
            case 200:
                await AsyncStorage.setItem('collaborator', JSON.stringify(response.collaborator));
                await AsyncStorage.removeItem('rememberMy');
                if(remember){
                    await AsyncStorage.setItem('rememberMy', '1');
                }
                navigation.navigate('DrawerNavigation',{screen : 'Home'} )
                setWaitProcessSingIn(false)
                break;
            case 409:
                setActiveSheet('danger')
                setMessageSheet(response.message)
                Sheet()
                setWaitProcessSingIn(false)
                break;
            default:
                setActiveSheet('danger')
                setMessageSheet(response.message)
                Sheet()
                setWaitProcessSingIn(false)
                break;
        };
        setWaitProcessSingIn(false)
    }

    useFocusEffect(handleFocus);

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

            { activeSheet === "success" ?
                <SuccessSheet message={messageSheet} />
                :
                <DangerSheet  message={messageSheet} />
            }
        </RBSheet>
        <View className='justify-center items-center h-40'>
            <Image
                className='h-60 w-60'
                resizeMode='contain'
                source={theme.dark ? IMAGES.appnamedark :IMAGES.appname}
            />
        </View>
        <ScrollView style={{flexGrow:1,}} showsVerticalScrollIndicator={false}>
            <View style={[GlobalStyleSheet.container,{flexGrow:1,paddingBottom:0,paddingHorizontal:30,paddingTop:0}]}>
                <View style={{}}>
                    <View style={{marginBottom:30}}>
                        <Text style={[styles.title1,{color:colors.title}]}>Acesso</Text>
                        <Text style={[styles.title2, {color: colors.title }]}>Entre com facilidade e segurança. Estamos aqui para facilitar seu dia a dia, desde o primeiro acesso.</Text>
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>CPF</Text>
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Input
                            prop_mask={'cpf'}
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            value={cpf}
                            onChangeText={ (masked, unmasked) => setCpf(unmasked) }
                            isFocused={isFocused}
                            keyboardType={'numeric'}
                            inputBorder
                        />
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>Senha</Text>
                    </View>
                    <View style={{ marginBottom: 10,marginTop:10 }}>
                        <Input
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            backround={colors.card}
                            value={password}
                            onChangeText={(value) => setpassword(value)}
                            isFocused={isFocused2}
                            type={'default'}
                            inputBorder
                        />
                    </View>
                </View>
                <View className='flex-row items-center'>
                            <View className='w-5'>
                                <BouncyCheckbox
                                    size={20}
                                    fillColor="#fde047"
                                    unfillColor="#f4f4f4"
                                    isChecked={true}
                                    iconStyle={{ borderColor: "#fde047" }}
                                    onPress={()=>setRemember(!remember)}
                                />
                            </View>
                            <Text className={'px-2 mt-1'} style={[styles.text,{color:colors.title}]}>Lembrar de mim</Text>
                        </View>
                <View style={{marginTop:25}}>
                    <Button
                        load={waitProcessSingIn}
                        loadSize={20}
                        loadColor={'#FFFFFF'}
                        title={"Entrar"}
                        color={COLORS.dark}
                        onPress={handleSingIn}
                        style={{borderRadius:52}}
                    />
                    <View 
                     className={`px-3 py-2 mt-2`}
                    >
                        <View className={`flex flex-row gap-2`}>
                            <Text style={[styles.text,{color:colors.title}]}>Esqueceu a Senha?</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                <Text style={{...FONTS.fontMedium,fontSize:14,color:COLORS.primary}}>Recuperar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className={`mt-2`} style={{marginBottom:15}}>
                        <Text style={[styles.title2, {color: colors.title,textAlign:'center',opacity:.5 }]}>Não tem uma conta?</Text>
                    </View>
                    <Button
                        title={"Criar uma conta"}
                        onPress={() => navigation.navigate('SignUp')}
                        text={COLORS.title}
                        color={COLORS.secondary}
                        style={{borderRadius:52}}
                    />
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    text:{
        ...FONTS.fontRegular,
        fontSize:14,
        color:COLORS.title,
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
        color: COLORS.title, 
    },
    title3:{
        ...FONTS.fontMedium,
        fontSize:14,
        color:'#8A8A8A'
    }
})

export default SingIn