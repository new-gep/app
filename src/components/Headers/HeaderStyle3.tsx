import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
// import FeatherIcon from 'react-native-vector-icons/Feather';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';
import FindBucketCollaborator from '../../hooks/bucket/collaborator';
import useCollaborator from '../../function/fetchCollaborator';

const HeaderStyle3 = () => {
    const {colors}:{colors : any} = useTheme();
    const [path, setPath] = useState<any | null>(null);
    const { collaborator, fetchCollaborator } = useCollaborator();
    
    const getPicture = async () => {
        try {
          const response = await FindBucketCollaborator(collaborator.CPF, 'Picture')
          if(response.status == 200){
            setPath(response.path)
          }
        } catch (error) {
          console.error('Erro ao resgatar a imagem:', error);
        }
    };

    useEffect(() => {
        fetchCollaborator(); 
    }, [])

    useEffect(()=>{
        if(collaborator){
            getPicture()
        }
    },[])

    return (
        <>
            <View style={{
                height:70,
                flexDirection:'row',
                alignItems:'center',
                paddingHorizontal:15,
            }}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={{uri: path}}
                            style={{
                                height:45,
                                width:45,
                                borderRadius:45,
                                marginRight:12,
                            }}
                        />
                    <View>
                        <Text>Documentos</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        height:45,
                        width:45,
                        borderWidth:1,
                        backgroundColor:colors.card,
                        borderRadius:SIZES.radius,
                        borderColor:colors.border,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    <View
                        style={{
                            position:'absolute',
                            zIndex:1,
                            height:10,
                            width:10,
                            top:11,
                            right:12,
                            borderRadius:8,
                            backgroundColor:COLORS.primary,
                            borderWidth:2,
                            borderColor:colors.card,
                        }}
                    />
                    <FeatherIcon name='bell' color={colors.title} size={20}/>
                </TouchableOpacity>
            </View>
        </>
    );
};



export default HeaderStyle3;