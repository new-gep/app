import React, { useState, useEffect, Children } from "react"
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons"
import { View, Text, Image } from "react-native"
import ListStyle1 from "../../components/List/ListStyle1"
import { GlobalStyleSheet } from "../../constants/StyleSheet"
import { COLORS, FONTS } from "../../constants/theme"
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { IMAGES } from "../../constants/Images"
import AsyncStorage from "@react-native-async-storage/async-storage"

type MissingDatesStorage = {
    // missingDocuments: string[];
    missingFields: string[];
} 

type MissingDatesProps = {
    Picture  :boolean;
    // RG       :boolean;
    // Work_Card:boolean;
    // Address  :boolean;
    // School_History:boolean;
    AddresField   :boolean;
    Marriage      :boolean;
    Children      :boolean;
    // Marriage_Certificate: boolean;
    // Birth_Certificate:boolean;
}

export default function CheckCadasterCollaboratorProfile() {
    const navigation = useNavigation<RootStackParamList>();
    const [missingDate, setMissingDate] = useState<MissingDatesProps>({
        Picture  :false,
        // RG       :false,
        // Work_Card:false,
        // Address  :false,
        // School_History:false,
        AddresField:false,
        Marriage:false,
        Children:false,
        // Marriage_Certificate:false,
        // Birth_Certificate:false
    });
    const [loading, setLoading] = useState(true); // Estado de carregamento

    const checkCadasterCollaborator = async () => {
        try {
            const storedData = await AsyncStorage.getItem('missingDates');
            if (storedData) {
                const parsedMissingDates: MissingDatesStorage = JSON.parse(storedData);
        
                // Garantir que missingDocuments e missingFields são arrays
                // const missingDocuments = Array.isArray(parsedMissingDates.missingDocuments) ? parsedMissingDates.missingDocuments : [];
                const missingFields    = Array.isArray(parsedMissingDates.missingFields) ? parsedMissingDates.missingFields : [];
        
                const newMissingDate = {
                    // RG: missingDocuments.includes("RG"),
                    // Work_Card: missingDocuments.includes("Work_Card"),
                    // Marriage_Certificate: missingDocuments.includes("Marriage_Certificate"),
                    // Address: missingDocuments.includes("Address"),
                    // School_History: missingDocuments.includes("School_History"),
                    // Birth_Certificate: missingDocuments.includes("Birth_Certificate"),
                    Picture: missingFields.includes("Picture"),
                    AddresField: missingFields.includes("address"),
                    Marriage: missingFields.includes("marriage"),
                    Children: missingFields.includes("children"),
                };
        
                setMissingDate(newMissingDate);
            }
        } catch (error) {
            console.error('Error retrieving or parsing missingDates:', error);
        } finally {
            setLoading(false); // Conclui a verificação do armazenamento e altera o estado de carregamento
        }
    };

    useEffect(() => {
        // Chama a função na montagem do componente
        checkCadasterCollaborator();

        // Listener para quando a tela for focada
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true);  // Inicia o estado de carregamento ao focar na tela
            checkCadasterCollaborator();  // Chama a função para verificar o storage novamente
        }) as () => void;

        // Retorna a função de limpeza para remover o listener de foco quando o componente for desmontado
        return () => {
            unsubscribe();  // Chama a função para remover o listener
        };
    }, [navigation]);
    
    return (
        <>
            {loading ? (
                <View>
                    <Text>Carregando...</Text>
                </View>
            ) : (
                <View className={`bg-dark px-5 rounded-b-3xl ${[missingDate.Picture, missingDate.AddresField, missingDate.Marriage, missingDate.Children].every(Boolean) && 'hidden'}`}>
                    <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder }]}>
                        <Text className={`text-xl text-primary`} style={{ ...FONTS.fontMedium }}>
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
                            {missingDate.Picture && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<AntDesign name={'user'} size={15} color={COLORS.primary} />}
                                    title={'Foto de perfil'}
                                />
                            )}
                            {missingDate.AddresField && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<SimpleLineIcons name={'location-pin'} size={15} color={COLORS.primary} />}
                                    title={'Endereço'}
                                />
                            )}
                            {missingDate.Marriage && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<Image style={{ width: 16, height: 16 }} resizeMethod="resize" source={IMAGES.ring} tintColor={COLORS.primary} />}
                                    title={'Casamento'}
                                />
                            )}
                            {missingDate.Children && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<Image style={{ width: 15, height: 15 }} resizeMethod="resize" source={IMAGES.children} tintColor={COLORS.primary} />}
                                    title={'Filhos'}
                                />
                            )}
                        </View>
                    </View>
                    {/* <View>
                        <View className={`mt-3`}>
                            <Text className={`text-white font-semibold`}>Documentação</Text>
                        </View>
                        <View style={GlobalStyleSheet.cardBody}>
                            {missingDate.RG && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                                    title={'RG'}
                                />
                            )}
                            {missingDate.Work_Card && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                                    title={'Carteira de Trabalho'}
                                />
                            )}
                            {missingDate.Address && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                                    title={'Comprovante de Endereço'}
                                />
                            )}
                            {missingDate.School_History && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                                    title={'Histórico Escolar'}
                                />
                            )}
                            {missingDate.Birth_Certificate && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                                    title={'Certidão de Nascimento'}
                                />
                            )}
                            {missingDate.Marriage_Certificate && (
                                <ListStyle1 
                                    onPress={() => { navigation.navigate('EditProfile') }}
                                    arrowRight 
                                    icon={<AntDesign name={'picture'} size={15} color={COLORS.primary} />}
                                    title={'Certidão de Casamento'}
                                />
                            )}
                        </View>
                    </View> */}
                </View>
            )}
        </>
    );
}
