import { AntDesign, SimpleLineIcons } from "@expo/vector-icons"
import { View, Text, Image  } from "react-native"
import ListStyle1 from "../../components/List/ListStyle1"
import { GlobalStyleSheet } from "../../constants/StyleSheet"
import { COLORS, FONTS } from "../../constants/theme"
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { IMAGES } from "../../constants/Images"
export default function CheckCadasterCollaboratorProfile(){

    const navigation = useNavigation<RootStackParamList>();

    return(
        <View className={`bg-dark px-5 rounded-b-3xl`}>
            <View style={[GlobalStyleSheet.cardHeader,{borderBottomColor:COLORS.inputborder}]}>
                <Text className={`text-xl text-primary`} style={{...FONTS.fontMedium,}} >
                    <AntDesign name="warning" size={24} color={COLORS.primary} />  Cadastro Incompleto 
                </Text>
                <Text className={`text-white text-xs mt-1`}>
                    Seu cadastro está incompleto. Envie as informações abaixo que faltam 
                    para liberar o uso da plataforma. 
                </Text>
                </View>
                <View style={[GlobalStyleSheet.cardHeader]}>
                    <View>
                        <Text className={`text-white font-semibold`}>Detalhes Pessoais</Text>
                    </View>
                    <View style={GlobalStyleSheet.cardBody}>
                        {
                            <ListStyle1 
                                onPress={()=>{navigation.navigate('EditProfile')}}
                                arrowRight 
                                icon={<AntDesign name={'user'} size={15} color={COLORS.primary} />}
                                title={'Foto de perfil'}
                            />
                        }
                                    
                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={<SimpleLineIcons name={'location-pin'} size={15} color={COLORS.primary} />}
                            title={'Endereço'}
                            />
                        }

                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={ <Image style={{width: 16, height: 16,}} resizeMethod="resize" source={IMAGES.ring} tintColor={COLORS.primary} />}
                            title={'Casamento'}
                            />
                        }

                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={ <Image style={{width: 15, height: 15,}} resizeMethod="resize" source={IMAGES.children} tintColor={COLORS.primary} />}
                            title={'Filhos'}
                            />
                        }

                        
                                    
                    </View>
                </View>
                <View>
                <View className={`mt-3`}>
                    <Text className={`text-white font-semibold`}>Documentação</Text>
                </View>
                <View style={GlobalStyleSheet.cardBody}>
                        {
                            <ListStyle1 
                                onPress={()=>{navigation.navigate('EditProfile')}}
                                arrowRight 
                                icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                                title={'RG'}
                            />
                        }
                                    
                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                            title={'Carteira de Trabalho'}
                            />
                        }

                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                            title={'Comprovante de Endereço'}
                            />
                        }

                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                            title={'Histórico Escolar'}
                            />
                        }

                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                            title={'CNH (opcional)'}
                            />
                        }

                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                            title={'Certificado militar (opcional)'}
                            />
                        }

                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                            title={'Certidão de nascimeto'}
                            />
                        }

                        {
                            <ListStyle1 
                            onPress={()=>{navigation.navigate('EditProfile')}}
                            arrowRight 
                            icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                            title={'Certidão de casamento'}
                            />
                        }
                                    
                </View>
            </View>
        </View>
    )
}