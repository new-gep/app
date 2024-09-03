import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Text ,TouchableOpacity,Image,ScrollView, StyleSheet} from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS,FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadScreenSimple from '../../components/LoadScreen/Simple';
import Mask from '../../utils/mask';
import ListStyle1 from '../../components/List/ListStyle1';
import CheckCadasterCollaboratorProfile from '../utils/checkCadasterCollaboratorProfile';
import { AntDesign, SimpleLineIcons  } from '@expo/vector-icons';
type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;
type propsCollaborator = {
    name    :string
    phone   :string
    email   :string
    zip_code:any
    street  :any
    district:any
    uf      :any
    city    :any
    number  :any
    complement?:any
}
const Profile = ({navigation} : ProfileScreenProps) => {
    const theme = useTheme();
    const { colors } : {colors : any} = theme;
    const [waitProcess, setAwaitProcess] = useState(false)
    const [collaborator, setCollaborator] = useState<propsCollaborator>({
        name : '',
        phone: '',
        email: '',
        zip_code:'',
        street:'',
        district:'',
        uf:'',
        city:'',
        number:'',
    })

    const profileData = [
        {
            id:"1",
            image:IMAGES.call,
            title:'Celular',
            subtitle: `+55 ${Mask('phone',collaborator.phone)}`
        },
        {
            id:"2",
            image:IMAGES.email,
            title:'E-mail',
            subtitle:Mask('emailBreakLine',collaborator.email)
        },
        {
            id:"3",
            image:IMAGES.map,
            title:'Endereço',
            subtitle:`${collaborator.zip_code ? '': 'Cadastro incompleto'}`
        },
        {
            id:"4",
            image:IMAGES.children,
            title:'Filhos',
            subtitle:`${collaborator.zip_code ? '': 'Cadastro incompleto'}`
        },
        {
            id:"5",
            image:IMAGES.ring,
            title:'Casamento',
            subtitle:`${collaborator.zip_code ? '': 'Cadastro incompleto'}`
        },
    ];

    const profilecartData = [
        {
            id:"1",
            title: "Ponto Digital\nRH",
            subtitle: "Gestão de Ponto",
            image:IMAGES.unique0
        },
        {
            id:"2",
            title: "Holerite Digital\nRH",
            subtitle:"Gestão de Holerite",
            image:IMAGES.unique1
        },
    
    ];

    const fetchData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('collaborator');
            if (storedData) {
                const collaboratorDates = JSON.parse(storedData) as {
                    name?: string; 
                    phone?: string; 
                    email?: string;
                    zip_code?: any;
                    street?  : any;
                    district?: any;
                    uf?      : any;
                    city?    : any;
                    number?  : any;
                    complement?: any;
                  };
                const { name, phone, email, zip_code, street, district, uf, city, number, complement } = collaboratorDates;
                if (name && phone && email) {
                    const props: propsCollaborator = { 
                        name, 
                        phone, 
                        email, 
                        zip_code, 
                        street, 
                        district, 
                        uf, 
                        city, 
                        number, 
                        complement 
                      };
                    setCollaborator(props)
                    setAwaitProcess(false)
                } else {
                    console.log('Missing name, phone, or email in collaborator data.');
                    
                }
            } else {
                console.log('No collaborator data found.');
                
            }
        } catch (error) {
            
        }
    };

    useEffect(()=>{
        fetchData()
    },[])

  return (
    <View style={{backgroundColor:colors.card,flex:1}}>
        <Header
            title='Perfil'
            leftIcon={'back'}
            rightIcon2={'Edit'}        
        />
        { waitProcess ?
            <LoadScreenSimple/>
            :
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{flexGrow:1,paddingBottom:50}}>
                <View className={`px-5`}>
                    <CheckCadasterCollaboratorProfile/>
                    {/* <View className={`bg-dark px-5 rounded-b-3xl`}>
                        <View style={[GlobalStyleSheet.cardHeader,{borderBottomColor:COLORS.inputborder}]}>
                            <Text className={`text-xl text-warning`} style={{...FONTS.fontMedium,}} >
                                <AntDesign name="warning" size={24} color={COLORS.warning} />  Cadastro Incompleto 
                            </Text>
                            <Text className={`text-white text-xs mt-1`}>
                                Seu cadastro está incompleto. Envie as informações abaixo que faltam 
                                para liberar o uso da plataforma. 
                            </Text>
                        </View>
                        <View className={`mt-3`}>
                            <View>
                                <Text className={`text-white font-semibold`}>Dados simples</Text>
                            </View>
                            <View style={GlobalStyleSheet.cardBody}>
                                <ListStyle1 
                                    onPress={()=>{navigation.navigate('EditProfile')}}
                                    arrowRight 
                                    icon={<AntDesign name={'user'} size={15} color={COLORS.warning} />}
                                    title={'Foto de perfil'}
                                />
                                { !collaborator.zip_code &&
                                    <ListStyle1 
                                        onPress={()=>{navigation.navigate('EditProfile')}}
                                        arrowRight 
                                        icon={<SimpleLineIcons name={'location-pin'} size={15} color={COLORS.warning} />}
                                        title={'Endereço'}
                                    />
                                }
                            </View>
                        </View>
                    </View> */}
                </View>
                <View style={[GlobalStyleSheet.container,{alignItems:'center',marginTop:50,padding:0}]}>
                    <View
                        className={`bg-neutral-300 rounded-full h-24 w-24 justify-center items-center `}
                    >
                        <Image
                            className={`w-14 h-14 rounded`}
                            source={IMAGES.user2}
                            tintColor={`white`}
                        />
                    </View>
                    <Text style={{...FONTS.fontSemiBold,fontSize:28,color:colors.title}}>{Mask('fullName',collaborator.name)}</Text>
                    <Text style={{...FONTS.fontRegular,fontSize:16,color:COLORS.primary}}>
                        { collaborator.zip_code?
                        'London, England'
                        :
                        'Cadastro incompleto'
                        }
                    </Text>
                </View>
                <View 
                    style={[GlobalStyleSheet.container,{paddingHorizontal:40,marginTop:20}]}
                >
                    <View>
                        {profileData.map((data:any ,index:any) => {
                            return(
                                <View
                                    key={index}
                                    style={[GlobalStyleSheet.flexcenter,{width:'100%',gap:20,justifyContent:'flex-start',marginBottom:25,alignItems:'flex-start'}]}
                                >
                                    <View
                                        style={[styles.cardimg,{backgroundColor:colors.card}]}
                                    >
                                        <Image
                                            style={[GlobalStyleSheet.image3,{tintColor:COLORS.primary}]}
                                            source={data.image}
                                        />
                                    </View>
                                    <View>
                                        <Text style={[styles.brandsubtitle2,{color:'#7D7D7D'}]}>{data.title}</Text>
                                        <Text className={``} style={{...FONTS.fontMedium,fontSize:16,color:colors.title,marginTop:5}}>{data.subtitle}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{padding:0}]}>
                    <View style={[GlobalStyleSheet.flex,{paddingHorizontal:30}]}>
                        <Text style={[styles.brandsubtitle3,{fontSize: 18,color:colors.title}]}>Serviços Dísponivel</Text>
                    </View>
                    <View style={{ marginHorizontal: -15, paddingHorizontal: 15, paddingTop: 25 }}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 30 }}
                            >
                                <View style={[styles.profilecard]}>
                                    {profilecartData.map((data: any, index) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => navigation.navigate('ProductsDetails')}      
                                                key={index}
                                                style={[styles.arrivaldata,{
                                                    backgroundColor:COLORS.dark,
                                                    borderColor:'#EFEFEF',
                                                }]}>
                                                <View style={[GlobalStyleSheet.flexcenter,{gap:20,justifyContent:'space-around'}]}>
                                                    <Image
                                                        style={{height:100,width:100,resizeMode:'contain',}}
                                                        source={data.image}
                                                    />
                                                    <View>
                                                        <Text numberOfLines={1} style={{ ...FONTS.fontMedium, fontSize: 16, color:  COLORS.primary}}>{data.title}</Text>
                                                        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                                                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color:COLORS.primary,opacity:.5 }}>{data.subtitle}</Text>
                                                            <Image
                                                                style={{height:16,width:16,resizeMode:'contain',}}
                                                                source={IMAGES.share}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                    </View>
                </View>
            </ScrollView> 
        }
    </View>
  )
}

const styles = StyleSheet.create({
    arrivaldata:{
        backgroundColor:COLORS.card,
        borderRadius: 20,
        //width:'100%',
        paddingHorizontal:15,
        borderWidth:1,
        borderColor:'#EFEFEF', 
    },
    sectionimg:{
        height:104,
        width:104,
        borderRadius:150,
        backgroundColor:COLORS.primary,
        overflow:'hidden',
        marginBottom:25
    },
    brandsubtitle2:{
        ...FONTS.fontRegular,
        fontSize:12
    },
    brandsubtitle3:{
        ...FONTS.fontMedium,
        fontSize:12,
        color:COLORS.title
    },
    profilecard:{
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 15, 
        marginRight: 10,
        marginBottom:20
    },
    cardimg:{
        height:54,
        width:54,
        borderRadius:55,
        backgroundColor:COLORS.card,
        shadowColor: "rgba(0,0,0,0.5)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 18.27,
        elevation: 10,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default Profile