import React, { useRef, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StatusBar, StyleSheet, } from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import { IMAGES } from '../../constants/Images'
import { FormValues, validateForm } from '../../utils/validateField'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import RBSheet from 'react-native-raw-bottom-sheet'
import DangerSheet from '../../components/BottomSheet/DangerSheet'
import UpdateCollaborator from '../../hooks/update/collaborator'
import AsyncStorage from '@react-native-async-storage/async-storage'
type NewPasswordScreenProps = StackScreenProps<RootStackParamList, 'NewPassword'>;
type Props = {
    cpf      :string
    password :string
 }
const NewPassword = ({navigation} : NewPasswordScreenProps) => {
    const refRBSheet = useRef<any>(null);
    const theme = useTheme();
    const { colors }: { colors : any} = theme;
    const [isFocused , setisFocused] = useState(false);
    const [isFocused2 , setisFocused2] = useState(false);
    const [messageSheet, setMessageSheet] = useState(String);
    const [waitProcessResetPassword, setWaitProcessResetPassword] = useState(false);
    const [formValues, setFormValues]  = useState<FormValues>({
        password: '',
        repeatPassword: '',
    });

    const Sheet = async () => {
        await refRBSheet.current.open();
    };

    const handleResetPassword = async () => {
        if(waitProcessResetPassword){
            return
        }
        const validationErrors = await validateForm(formValues);
        if (Object.keys(validationErrors).length !== 0) {
                const firstErrorMessage = Object.values(validationErrors)[0];
                setMessageSheet(firstErrorMessage)
                setWaitProcessResetPassword(false)
                Sheet()
                return
        };
        let collaboratorDates = await AsyncStorage.getItem('datesForgotPassword');  
        if(collaboratorDates){
            const collaborator = JSON.parse(collaboratorDates) ;
            let cpf      = collaborator.cpf
            let password = formValues.password;
            if(cpf && password){
                let updateCollaborator = {
                    password : formValues.password
                }   
                const response = await UpdateCollaborator(cpf, updateCollaborator)
                switch (response.status) {
                    case 200:
                        await AsyncStorage.setItem('collaboratorCreateNewPasswordSuccess', 'success');
                        navigation.navigate('SingIn')
                        return
                    case 409:
                        setMessageSheet('Não foi possível atualizar')
                        Sheet()
                        setWaitProcessResetPassword(false)
                        return
                    default:
                        setMessageSheet('Tente mais tarde, algo deu errado!')
                        Sheet()
                        setWaitProcessResetPassword(false)
                        return
                }
            }
        }
        setMessageSheet('Algo deu errado, reinicie o app.')
        Sheet()
        setWaitProcessResetPassword(false)
        return
    };

  return (
    <SafeAreaView style={{flex:1,backgroundColor: colors.card,}}>
       <View className={`px-10`} style={[GlobalStyleSheet.container,GlobalStyleSheet.flexcenter,{paddingVertical:50,}]}>
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

                        <DangerSheet message={messageSheet} />
            </RBSheet>
            <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
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
            <View style={[GlobalStyleSheet.container,{flexGrow:1,paddingBottom:0,paddingHorizontal:30,paddingTop:0}]}>
                <ScrollView style={{flex:1,}} showsVerticalScrollIndicator={false}>
                    <View style={{marginBottom:30}}>
                        <Text style={[styles.title1,{color:colors.title}]}>Alterar Senha</Text>
                        <Text style={[styles.title2, {color: colors.title }]}>Identidade confirmada! Agora, insira uma nova senha de acesso</Text>
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>Senha</Text>
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Input
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            backround={colors.card}
                            value={formValues.password }
                            onChangeText={(value) => setFormValues({ ...formValues, password: value })}
                            isFocused={isFocused}
                            type={'password'}
                            inputBorder
                        />
                    </View>
                    <View style={[GlobalStyleSheet.container,{padding:0}]}>
                        <Text style={[styles.title3,{color:'#8A8A8A'}]}>Senha Novamente</Text>
                    </View>
                    <View style={{ marginBottom: 10,marginTop:10 }}>
                        <Input
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            backround={colors.card}
                            value={formValues.repeatPassword }
                            onChangeText={(value) => setFormValues({ ...formValues, repeatPassword: value })}
                            isFocused={isFocused2}
                            type={'password'}
                            inputBorder
                        />
                    </View>
                </ScrollView>
                <View style={[GlobalStyleSheet.container,{paddingTop:0,paddingHorizontal:0}]}>
                    <Button
                        load={waitProcessResetPassword}
                        loadSize={20}
                        loadColor={'#FFFFFF'}
                        text={COLORS.title}
                        color={COLORS.secondary}
                        title={"Continuar"}
                        onPress={handleResetPassword}
                        style={{borderRadius:52}}
                    />
                    <View style={[GlobalStyleSheet.bottombtn]}>
                        <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title}]}>Voltar para</Text>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('SingIn')}>
                            <Text style={styles.title4}>Acesso</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
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
        ...FONTS.fontLight,
        fontSize:14,
        color:COLORS.title,
        textDecorationLine:'underline'
    },
    title1:{
        ...FONTS.fontSemiBold,
         fontSize: 25,
        color: COLORS.title,
        marginBottom: 5 
    },
    title2:{
        ...FONTS.fontLight,
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
        textDecorationColor:COLORS.primary
    },
    icon:{
        height:28,
        width:28,
        resizeMode:'contain',
    }

})

export default NewPassword