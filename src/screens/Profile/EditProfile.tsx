import React, { useEffect, useState } from 'react'
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

type inputUpdateDates = {
    name :string,
    phone:string,
    email:string,
    zip_code: string | null;
    street  : string | null;
    district: string | null;
    city    : string | null;
    uf      : string | null;
    number  : string | null;
    complement?: string | null;
}

const EditProfile = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;
    const navigation = useNavigation<any>();
    const { collaborator, fetchCollaborator } = useCollaborator();
    const [isFocused, setisFocused] = useState(false)
    const [isFocused1, setisFocused1] = useState(false)
    const [isFocused2, setisFocused2] = useState(false)
    const [isFocused3, setisFocused3] = useState(false)
    const [imageUrl, setImageUrl] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [hasAddressNumber, setHasAddressNumber] = useState(true);
    const [hasMarriage, setHasMarriage] = useState(false);
    const [hasChildren, setHasChildren] = useState(false);
    const [ collaboratorUpdateDates, setCollaboratorUpdateDates] = useState <inputUpdateDates> ({
        name :'',
        phone:'',
        email:'',
        zip_code: '',
        street  : '',
        district: '',
        city    : '',
        uf      : '',
        number  : '',
    });
    const [children, setChildren] = useState([{ name: '', age: '' }]);

    const addChild = () => {
        setChildren([...children, { name: '', age: '' }]); // Adiciona um novo filho ao array
    };
    
    const updateChild = (index: number, field: 'name' | 'age', value: string) => {
        const updatedChildren = [...children];
        updatedChildren[index][field] = value;
        setChildren(updatedChildren); // Atualiza o estado com as mudanças
    };

    const removeChild = (index:any) => {
        const updatedChildren = children.filter((_, i) => i !== index); // Remove o filho pelo índice
        setChildren(updatedChildren);
    };
    
    const handleChange = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue(numericValue); 
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

    useEffect(()=>{
        fetchCollaborator()
    },[])

    useEffect(()=>{
        if(collaborator){
            setCollaboratorUpdateDates({
                name : collaborator.name   ,
                phone: collaborator.phone ,
                email: collaborator.email ,
                zip_code: collaborator.zip_code || '',
                street  : collaborator.street   || '',
                district: collaborator.district || '',
                city    : collaborator.city     || '',
                uf      : collaborator.uf       || '',
                number  : collaborator.number   || '',
                complement : collaborator.complement || ''
            });
        }
    },[collaborator])

    return (
       <View style={{backgroundColor:colors.background,flex:1}}>
           <Header
                title='Editar Perfil'
                leftIcon='back'
                titleRight
           />
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
                            onChangeText={(value) => console.log(value)}
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
                            onChangeText={(value) => handleChange(value)}
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
                            onChangeText={(value) => console.log(value)}
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
                                <ToggleStyle3 active={hasMarriage} setActive={setHasMarriage}/>
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

                        {/* Se o toggle indicar que a pessoa tem filhos, exibe o formulário */}
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
                                    onFocus={() => setisFocused3(true)}
                                    onBlur={() => setisFocused3(false)}
                                    isFocused={isFocused3}
                                    onChangeText={(value) => console.log(value)}
                                    backround={colors.card}
                                    style={{borderRadius:48}}
                                    inputicon
                                    placeholder='CEP'
                                    icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}

                                />
                            </View>

                            <View className={`mb-3`}>
                                <Input  
                                    onFocus={() => setisFocused3(true)}
                                    onBlur={() => setisFocused3(false)}
                                    isFocused={isFocused3}
                                    onChangeText={(value) => console.log(value)}
                                    backround={colors.card}
                                    style={{borderRadius:48}}
                                    inputicon
                                    placeholder='Rua'
                                    icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}

                                />
                            </View>

                            <View className={`mb-3 flex-row items-center justify-between`}>
                                <View className={`w-2/4`}>
                                    <Input  
                                        onFocus={() => setisFocused3(true)}
                                        onBlur={() => setisFocused3(false)}
                                        isFocused={isFocused3}
                                        value={hasAddressNumber ? '' : 'S/N'}
                                        onChangeText={(value) => console.log(value)}
                                        backround={colors.card}
                                        style={{borderRadius:48}}
                                        inputicon
                                        editable={!hasAddressNumber}
                                        placeholder='Número'
                                        icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}
                                    />
                                </View>
                                <View>
                                    <Text className={`text-[#222222] text-xs`} style={FONTS.fontRegular}>Tem número?</Text>
                                    <ToggleStyle3 active={hasAddressNumber} setActive={setHasAddressNumber}/>
                                </View>
                            </View>

                            <View className={`mb-3`}>
                                <Input  
                                    onFocus={() => setisFocused3(true)}
                                    onBlur={() => setisFocused3(false)}
                                    isFocused={isFocused3}
                                    onChangeText={(value) => console.log(value)}
                                    backround={colors.card}
                                    style={{borderRadius:48}}
                                    inputicon
                                    placeholder='Complemento (opcional)'
                                    icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}

                                />
                            </View>

                            <View className={`mb-3`}>
                                <Input  
                                    onFocus={() => setisFocused3(true)}
                                    onBlur={() => setisFocused3(false)}
                                    isFocused={isFocused3}
                                    onChangeText={(value) => console.log(value)}
                                    backround={colors.card}
                                    style={{borderRadius:48}}
                                    inputicon
                                    placeholder='Bairro'
                                    icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}

                                />
                            </View>

                            <View className={`mb-3`}>
                                <Input  
                                    onFocus={() => setisFocused3(true)}
                                    onBlur={() => setisFocused3(false)}
                                    isFocused={isFocused3}
                                    onChangeText={(value) => console.log(value)}
                                    backround={colors.card}
                                    style={{borderRadius:48}}
                                    inputicon
                                    placeholder='Cidade'
                                    icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}

                                />
                            </View>

                            <View className={`mb-3 w-1/2`}>
                                <Input  
                                    onFocus={() => setisFocused3(true)}
                                    onBlur={() => setisFocused3(false)}
                                    isFocused={isFocused3}
                                    onChangeText={(value) => console.log(value)}
                                    backround={colors.card}
                                    style={{borderRadius:48}}
                                    inputicon
                                    placeholder='UF'
                                    icon={<Image source={IMAGES.plusDuotone} style={[styles.icon,{tintColor:colors.title}]}/>}

                                />
                            </View>
                        </View>
                </View>
            </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container]}>
                <Button
                    title='Update Profile'
                    color={COLORS.primary}
                    text={ COLORS.card}
                    onPress={() => navigation.navigate('Profile')}
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