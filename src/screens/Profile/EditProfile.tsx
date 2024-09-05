import React, { useEffect, useRef, useState } from 'react'
import { View, Text,  ScrollView, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import Input from '../../components/Input/Input';
import ImagePicker from 'react-native-image-crop-picker';
import Button from '../../components/Button/Button';
import { COLORS, FONTS } from '../../constants/theme';
import useCollaborator from '../../utils/fetchCollaborator';
import Mask from '../../utils/mask';
import ToggleStyle3 from '../../components/Toggles/ToggleStyle3';
import UpdateCollaborator from '../../hooks/update/collaborator';
import FindCep from '../../hooks/find/cep';
import RBSheet from 'react-native-raw-bottom-sheet';
import DangerSheet from '../../components/BottomSheet/DangerSheet';
import SuccessSheet from '../../components/BottomSheet/SuccessSheet';
import ValidateCollaboratorAndBlock from '../utils/validateCollaboratorAndBlock';
import { useCollaboratorContext } from '../../context/CollaboratorContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
type inputUpdateDates = {
    name :string,
    phone:string,
    email:string,
    marriage:string,
    children: { [key: string]: { name: string; birth: string } } | 0;
    zip_code: string;
    street  : string;
    district: string;
    city    : string;
    uf      : string;
    number  : string;
    complement?: string;
}
type ChildType = {
    name: string;
    birth: string;
};
const EditProfile = () => {
    const refRBSheet = useRef<any>(null);
    const theme = useTheme();
    const { colors } : {colors : any} = theme;
    const navigation = useNavigation<any>();
    const { collaborator, fetchCollaborator } = useCollaborator();
    const [isFocused, setisFocused] = useState(false)
    const [isFocused1, setisFocused1] = useState(false)
    const [isFocused2, setisFocused2] = useState(false)
    const [isFocused3, setisFocused3] = useState(false)
    const [isFocusedCep, setIsFocusedCep] = useState(false);
    const [isFocusedStreet, setIsFocusedStreet] = useState(false);
    const [isFocusedNumber, setIsFocusedNumber] = useState(false);
    const [isFocusedComplement, setIsFocusedComplement] = useState(false);
    const [isFocusedDistrict, setIsFocusedDistrict] = useState(false);
    const [isFocusedCity, setIsFocusedCity] = useState(false);
    const [isFocusedUf, setIsFocusedUf] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [messageSheet  , setMessageSheet] = useState(String);
    const [activeSheet, setActiveSheet] = useState(String);
    const [hasAddressNumber, setHasAddressNumber] = useState(true);
    const [hasMarriage, setHasMarriage] = useState(false);
    const [hasChildren, setHasChildren] = useState(false);
    const [isCepUpdated, setIsCepUpdated] = useState(false);
    const [collaboratorUpdateDates, setCollaboratorUpdateDates] = useState <inputUpdateDates> ({
        name :'',
        phone:'',
        email:'',
        marriage:'0',
        children:0,
        zip_code: '',
        street  : '',
        district: '',
        city    : '',
        uf      : '',
        number  : '',
    });
    const [children, setChildren] = useState([{ name: '', age: '' }]);
    const { validateCollaborator, missingData } = useCollaboratorContext();

    const addChild = () => {
        setChildren([...children, { name: '', age: '' }]); // Adiciona um novo filho ao array
    };

    const Sheet = async () => {
        await refRBSheet.current.open();
    };
    
    const updateChild = (index: number, field: 'name' | 'age', value: string) => {
        const updatedChildren = [...children];
        updatedChildren[index][field] = value;
        setChildren(updatedChildren); // Atualiza o estado com as mudanças
        setCollaboratorUpdateDates((prev) => ({
            ...prev,
            children: convertChildrenToObject(updatedChildren)
        }));
    };

    const removeChild = (index:any) => {
        const updatedChildren = children.filter((_, i) => i !== index); // Remove o filho pelo índice
        setChildren(updatedChildren);
        setCollaboratorUpdateDates((prev) => ({
            ...prev,
            children: convertChildrenToObject(updatedChildren), // Atualiza o estado do colaborador com a nova lista de filhos
        }));
    };
    
    const convertChildrenToObject = (childrenArray: { name: string; age: string }[]) => {
        const childrenObject: { [key: string]: { name: string; birth: string } } = {};
        childrenArray.forEach((child, index) => {
            childrenObject[`child${index + 1}`] = {
                name: child.name,
                birth: child.age, // Aqui você pode fazer uma conversão para "birth" se necessário
            };
        });
        return childrenObject;
    };

    const handleZipCodeChange = (newZipCode:string) => {
        setCollaboratorUpdateDates((prevState) => ({
            ...prevState,
            zip_code: newZipCode,
        }));
        setIsCepUpdated(true); // Marca que o usuário alterou o CEP
    };

    const handleUpdateProfile = async () => {
        if(collaborator){
            const response = await UpdateCollaborator(collaborator.CPF,collaboratorUpdateDates );
            switch (response.status) {
                case 200:
                    await AsyncStorage.setItem('collaborator', JSON.stringify(response.collaborator.collaborator))
                    setMessageSheet('Informações atualizadas')
                    setActiveSheet('success')
                    Sheet()
                    validateCollaborator()
                    break;
            
                default:
                    break;
            }
        }

    };

    // const handleImageSelect = () => {
    //     if(Platform.OS == 'android'){
    //         try {
    //             ImagePicker.openPicker({
    //                 width: 200,
    //                 height: 200,
    //                 cropping: true
    //             }).then((image: { path: React.SetStateAction<string>; })  => {
    //                 setImageUrl(image.path);
    //             });
    //         } catch (e) {
    //             console.log(e);
    //         }
            
    //     }
    // }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCollaborator(); 
        });

        return unsubscribe;
    }, [navigation])

    useEffect(()=>{
        if(collaborator){
                setCollaboratorUpdateDates({
                    name : collaborator.name  ,
                    phone: collaborator.phone ,
                    email: collaborator.email ,
                    marriage: collaborator.marriage || '0' ,
                    children: collaborator.children || 0,
                    zip_code: collaborator.zip_code || '',
                    street  : collaborator.street   || '',
                    district: collaborator.district || '',
                    city    : collaborator.city     || '',
                    uf      : collaborator.uf       || '',
                    number  : collaborator.number   || '',
                    complement : collaborator.complement || ''
                });
                if (collaborator.children && typeof collaborator.children === 'object') {
                    setHasChildren(true);
            
                    // Mapeia os filhos do objeto `collaborator.children`
                    const childrenArray = Object.keys(collaborator.children).map((key) => {
                        const child = (collaborator.children as { [key: string]: ChildType })[key]; // Faz um cast explícito
                        return {
                            name: child.name,
                            age: child.birth, // Aqui você pode converter a data de nascimento para idade, se necessário
                        };
                    });
            
                    setChildren(childrenArray);
                } else {
                    setHasChildren(false);
                    setChildren([{ name: '', age: '' }]); // Reseta o estado se não houver filhos
                }
                if(collaborator.marriage){
                    if(collaborator.marriage == '1'){
                        setHasMarriage(true)
                    }else{
                        setHasMarriage(false)
                    }
                }else{
                    setHasMarriage(false)
                }
        }

    },[collaborator])

    useEffect(() => {
        const fetchCepData = async () => {
            if (collaboratorUpdateDates.zip_code.length === 8) {
                const response = await FindCep(collaboratorUpdateDates.zip_code);
                // Verifica se o CEP foi encontrado
                if (response && !response.erro) {
                    // Atualiza os dados do colaborador com os valores retornados pelo CEP
                    setCollaboratorUpdateDates((prevState) => ({
                        ...prevState,
                        street: response.logradouro || prevState.street,
                        district: response.bairro || prevState.district,
                        city: response.localidade || prevState.city,
                        uf: response.uf || prevState.uf,
                        complement: response.complemento || prevState.complement
                    }));
                    
                } else {
                    // CEP não encontrado
                    
                }
            }
        };
        if (isCepUpdated) {
            fetchCepData(); 
        }
    }, [collaboratorUpdateDates.zip_code, isCepUpdated]);    

    useEffect(()=>{
        const toogleActions = () => {
            setCollaboratorUpdateDates((prevState) => ({
                ...prevState,
                marriage: hasMarriage ? '1' : '0', 
            }));
            if(!hasAddressNumber){
                setCollaboratorUpdateDates((prevState) => ({
                    ...prevState,
                    number:'S/N', 
                }));
            }
            if(!hasChildren){
                setCollaboratorUpdateDates((prevState) => ({
                    ...prevState,
                    children: 0 , 
                }));
                setChildren([{ name: '', age: '' }])
            }

        }
        toogleActions()
    },
    [hasMarriage, hasChildren, hasAddressNumber])

    return (
       <View style={{backgroundColor:colors.background,flex:1}}>
           <Header
                title='Editar Perfil'
                leftIcon='back'
                titleRight
           />
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
            <ScrollView contentContainerStyle={{flexGrow:1,paddingHorizontal:15,marginBottom:50}}>
                <View style={[GlobalStyleSheet.container, {backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginTop:10,borderRadius:15}]}>
                    <View className={`w-full`} style={{flexDirection:'row',alignItems:'center',gap:20}}>
                        <View style={{}}>
                            { 1 > 0 ?
                                <View className={`bg-neutral-300`} style={styles.imageborder}>
                                    <Image
                                        style={{ height: 60, width: 60 }}
                                        source={IMAGES.user2}
                                        tintColor={`white`}
                                    />
                                </View>
                                :
                                <View style={styles.imageborder}>
                                    <Image
                                        style={{ height: 82, width: 82, borderRadius: 50 }}
                                        source={IMAGES.small6}
                                    />
                                </View>
                            }
                            <TouchableOpacity
                                activeOpacity={0.8}
                                // onPress={handleImageSelect} 
                                style={[styles.WriteIconBackground,{ backgroundColor: colors.card }]}
                            >
                                <View style={styles.WriteIcon}>
                                    <Image
                                        style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: COLORS.card }}
                                        source={IMAGES.write}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View className={`w-4/6 `}>
                            <Text style={[FONTS.fontMedium,{fontSize:19,color:colors.title}]}>{collaborator && Mask('fullName',collaborator.name)}</Text>
                            <Text className={``} style={[FONTS.fontRegular,{fontSize:12,color:colors.text}]}>Última atualização: {collaborator && collaborator.update_at ? `${Mask('dateFormatBrazil',collaborator.update_at)}` : Mask('dateFormatBrazil',collaborator?.create_at ?? '')}</Text>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginTop:10,paddingVertical:10,borderRadius:15}]}>
                    <View style={[styles.cardBackground,{ borderBottomColor:COLORS.inputborder,borderStyle:'dashed'}]}>
                        <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Informação Pessoais</Text>
                    </View>
                    <View style={{ marginBottom: 15, marginTop: 10 }}>
                        <Input 
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            isFocused={isFocused}
                            value={collaboratorUpdateDates.name}
                            onChangeText={(value) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, name :value })}
                            backround={colors.card}
                            style={{borderRadius:48}}
                            inputicon
                            placeholder='Nome Completo'
                            icon={<Image source={IMAGES.user1} style={[styles.icon,{tintColor:colors.title}]}/>}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Input  
                            prop_mask={'phone'}
                            onFocus={() => setisFocused1(true)}
                            onBlur={() => setisFocused1(false)}
                            isFocused={isFocused1}
                            value={collaboratorUpdateDates.phone}
                            onChangeText={(value, noMask) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, phone :noMask || '' })}
                            backround={colors.card} 
                            style={{borderRadius:48}}
                            keyboardType={'number-pad'}
                            inputicon
                            placeholder='Celular'
                            icon={<Image source={IMAGES.Phoneduotone} style={[styles.icon,{tintColor:colors.title}]}/>}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Input  
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            isFocused={isFocused2}
                            value={collaboratorUpdateDates.email}
                            onChangeText={(value) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, email :value })}
                            backround={colors.card}
                            style={{borderRadius:48}}
                            inputicon
                            placeholder='Email'
                            icon={<Image source={IMAGES.email2} style={[styles.icon,{tintColor:colors.title}]}/>}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <View className={`mb-1`}>
                            <View className={`flex-row items-end mb-2`}>
                                <Image source={IMAGES.ringDuotone} style={[styles.icon]}/>
                                <Text className={`text-[#222222]`} style={FONTS.fontRegular}>Você é casado(a)?</Text>
                            </View>
                            <View className={`px-10`}>
                               
                                <ToggleStyle3 active={hasMarriage} setActive={setHasMarriage} />
                               
                            </View>
                        </View>
                    </View> 
                    <View style={{ marginBottom: 15 }}>
                        <View style={{ marginBottom: 15 }}>
                            <View className={`mb-1`}>
                                <View className={`flex-row items-end mb-2`}>
                                    <Image className={`mr-1`} source={IMAGES.childrenDuotone} style={[{ width: 24, height: 24 }]} />
                                    <Text className={`text-[#222222]`} style={FONTS.fontRegular}>Você tem filhos?</Text>
                                </View>
                                <View className={`px-10`}>
                                    <ToggleStyle3 active={hasChildren} setActive={setHasChildren} />
                                </View>
                            </View>

                            {hasChildren && (
                                <View className={`mt-5`}>
                                    {children.map((child, index) => (
                                        <View key={index} style={{ marginBottom: 10 }}>
                                            <View className={``}>
                                                <View className={`items-center`}>
                                                    <Text style={FONTS.fontRegular}>Filho {index + 1}</Text>
                                                    <View className={`mb-3 w-3/4`}>
                                                        <Input
                                                            placeholder="Nome do filho"
                                                            value={child.name}
                                                            onChangeText={(value) => updateChild(index, 'name', value)}
                                                            backround={colors.card}
                                                            style={{borderRadius:48}}
                                                            inputicon
                                                            icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}
                                                        />
                                                    </View>
                                                    <View className={`mb-3 w-3/4`}>
                                                        <Input
                                                            prop_mask={`date`}
                                                            placeholder="Data de nascimento"
                                                            value={child.age}
                                                            onChangeText={(value) => updateChild(index, 'age', value)}
                                                            keyboardType="numeric"
                                                            backround={colors.card}
                                                            style={{borderRadius:48}}
                                                            inputicon
                                                            icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}
                                                        />
                                                    </View>
                                                </View>
                                                <TouchableOpacity 
                                                    className={`bg-danger p-2 w-20 text-center items-center rounded-lg`}
                                                    onPress={() => removeChild(index)}
                                                >
                                                    <Text className={`font-semibold text-white`}>Remover</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}

                                    {/* Botão para adicionar mais filhos */}
                                    <TouchableOpacity onPress={addChild} style={{ marginTop: 10 }}>
                                        <View style={{
                                            backgroundColor: '#4CAF50',
                                            padding: 10,
                                            borderRadius: 5,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Adicionar Mais Filho</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                    <View>
                        <View className={`flex-row items-end mb-1`}>
                                <Image source={IMAGES.Pinduotone} style={[styles.icon,{tintColor:colors.title}]}/>
                                <Text className={`text-[#222222]`} style={FONTS.fontRegular}>Endereço</Text>
                        </View>
                        <View className={`px-5`} style={{ marginBottom: 15 }}>
                                <View className={`mb-3`}>
                                    <Input
                                        prop_mask={"cep"}
                                        onFocus={() => setIsFocusedCep(true)}
                                        onBlur={() => setIsFocusedCep(false)}
                                        keyboardType={'numeric'}
                                        isFocused={isFocusedCep}
                                        value={collaboratorUpdateDates.zip_code}
                                        onChangeText={(value,noMask) => handleZipCodeChange(noMask || '')}
                                        backround={colors.card}
                                        style={{ borderRadius: 48 }}
                                        inputicon
                                        placeholder='CEP'
                                        icon={<Image source={IMAGES.plusDuotone} style={[styles.icon, { tintColor: colors.title }]} />}
                                    />
                                </View>

                                <View className={`mb-3`}>
                                    <Input
                                        onFocus={() => setIsFocusedStreet(true)}
                                        onBlur={() => setIsFocusedStreet(false)}
                                        isFocused={isFocusedStreet}
                                        value={collaboratorUpdateDates.street}
                                        onChangeText={(value) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, street: value })}
                                        backround={colors.card}
                                        style={{ borderRadius: 48 }}
                                        inputicon
                                        placeholder='Rua'
                                        icon={<Image source={IMAGES.plusDuotone} style={[styles.icon, { tintColor: colors.title }]} />}
                                    />
                                </View>

                                <View className={`mb-3 flex-row items-center justify-between`}>
                                    <View className={`w-2/4`}>
                                        <Input
                                            onFocus={() => setIsFocusedNumber(true)}
                                            onBlur={() => setIsFocusedNumber(false)}
                                            isFocused={isFocusedNumber}
                                            value={collaboratorUpdateDates.number}
                                            onChangeText={(value) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, number: value })}
                                            backround={colors.card}
                                            style={{ borderRadius: 48 }}
                                            inputicon
                                            placeholder='Número'
                                            icon={<Image source={IMAGES.plusDuotone} style={[styles.icon, { tintColor: colors.title }]} />}
                                        />
                                    </View>
                                    <View>
                                        <Text className={`text-[#222222] text-xs`} style={FONTS.fontRegular}>Tem número?</Text>
                                        <ToggleStyle3 active={hasAddressNumber} setActive={setHasAddressNumber}/>
                                    </View>
                                </View>

                                <View className={`mb-3`}>
                                    <Input
                                        onFocus={() => setIsFocusedComplement(true)}
                                        onBlur={() => setIsFocusedComplement(false)}
                                        isFocused={isFocusedComplement}
                                        value={collaboratorUpdateDates.complement || ''}
                                        onChangeText={(value) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, complement: value })}
                                        backround={colors.card}
                                        style={{ borderRadius: 48 }}
                                        inputicon
                                        placeholder='Complemento (opcional)'
                                        icon={<Image source={IMAGES.plusDuotone} style={[styles.icon, { tintColor: colors.title }]} />}
                                    />
                                </View>

                                <View className={`mb-3`}>
                                    <Input
                                        onFocus={() => setIsFocusedDistrict(true)}
                                        onBlur={() => setIsFocusedDistrict(false)}
                                        isFocused={isFocusedDistrict}
                                        value={collaboratorUpdateDates.district}
                                        onChangeText={(value) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, district: value })}
                                        backround={colors.card}
                                        style={{ borderRadius: 48 }}
                                        inputicon
                                        placeholder='Bairro'
                                        icon={<Image source={IMAGES.plusDuotone} style={[styles.icon, { tintColor: colors.title }]} />}
                                    />
                                </View>

                                <View className={`mb-3`}>
                                    <Input
                                        onFocus={() => setIsFocusedCity(true)}
                                        onBlur={() => setIsFocusedCity(false)}
                                        isFocused={isFocusedCity}
                                        value={collaboratorUpdateDates.city}
                                        onChangeText={(value) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, city: value })}
                                        backround={colors.card}
                                        style={{ borderRadius: 48 }}
                                        inputicon
                                        placeholder='Cidade'
                                        icon={<Image source={IMAGES.plusDuotone} style={[styles.icon, { tintColor: colors.title }]} />}
                                    />
                                </View>

                                <View className={`mb-3 w-1/2`}>
                                    <Input
                                        classStyles='uppercase'
                                        length={2}
                                        onFocus={() => setIsFocusedUf(true)}
                                        onBlur={() => setIsFocusedUf(false)}
                                        isFocused={isFocusedUf}
                                        value={collaboratorUpdateDates.uf}
                                        onChangeText={(value) => setCollaboratorUpdateDates({ ...collaboratorUpdateDates, uf: value })}
                                        backround={colors.card}
                                        style={{ borderRadius: 48 }}
                                        inputicon
                                        placeholder='UF'
                                        icon={<Image source={IMAGES.plusDuotone} style={[styles.icon, { tintColor: colors.title }]} />}
                                    />
                                </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            
            <View style={[GlobalStyleSheet.container]}>
                <Button
                    title='Atualizar Perfil'
                    color={COLORS.primary}
                    text={ COLORS.card}
                    onPress={handleUpdateProfile}
                    style={{borderRadius:50}}
                />
            </View> 
       </View>
    )
}

const styles = StyleSheet.create({
    icon:{
        height:28,
        width:28,
        resizeMode:'contain',
    },
    cardBackground:{
        marginTop: 10,
        borderBottomWidth:1,
        borderBottomColor:COLORS.background,
        marginHorizontal:-15,
        paddingHorizontal:15,
        paddingBottom:15,
        marginBottom:10 
    },
    imageborder:{
        borderWidth: 2, 
        borderColor:COLORS.primary, 
        height: 90,
        width: 90, 
        borderRadius: 50, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    WriteIconBackground:{
        height: 42, 
        width: 42, 
        borderRadius: 40, 
        backgroundColor: COLORS.card, 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute', 
        bottom: 0, 
        left:60
    },
    WriteIcon:{
        height: 36, 
        width: 36, 
        borderRadius: 36, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor:COLORS.primary 
    },
    InputTitle:{
        ...FONTS.fontMedium, 
        fontSize: 13, 
        color:COLORS.title,
        marginBottom:5
    },
    bottomBtn:{
        height:75,
        width:'100%',
        backgroundColor:COLORS.card,
        justifyContent:'center',
        paddingHorizontal:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
    }
})

export default EditProfile