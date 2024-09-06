import React from 'react';
import { View, Text, ScrollView,  } from 'react-native';
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Cardstyle4 from '../../components/Card/Cardstyle4';
import { useEffect } from 'react';
import { useCollaboratorContext } from '../../context/CollaboratorContext';

const Documents = () => {
    const PDFTeste = require('../../assets/PDF/teste.pdf');
    const { validateCollaborator, missingData } = useCollaboratorContext();

    useEffect(()=>{

    },[])
    
    
    const MyorderData = [
        {
            image:IMAGES.item3,
            DocumentName: 'RG',
            sendDocument: true,
            typeDocument: 'picture',
            twoPicture:  true,
            statusDocument:'pending'
        },
        {
            pdf:PDFTeste,
            DocumentName: 'CNH',
            sendDocument: false,
            typeDocument: 'pdf',
            twoPicture:  false,
            statusDocument:'aproved'
        },
        {
            id:"32",
            image:IMAGES.item1,
            title:'RG',
            price:"Aprovado",
            info:"PDF",
            btntitle:'Enviar',
            EditReview:true,
            completed:true,
            status : "completed",
        },
        
    ]

    return(
        <View style={{backgroundColor:COLORS.background,flex:1}}>
            <Header
                title='Documentos'
                leftIcon='back'
                //titleLeft
                iconSimple={`folder`}
            />
            <View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1,paddingBottom:70,}}>
                <View style={[GlobalStyleSheet.container, { paddingTop: 20,paddingHorizontal:10 }]}>
                    <View style={{ }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <View>
                                {MyorderData.map((data:any, index) => {
                                    return (
                                        <View   key={index} style={{marginBottom:30}}>
                                            <Cardstyle4
                                                documentName={data.DocumentName}
                                                sendDocument={data.sendDocument}
                                                typeDocument={data.typeDocument}
                                                statusDocument={data.statusDocument}
                                                twoPicture={data.twoPicture}
                                                image={data.image}
                                                pdf={data.pdf}
                                            />
                                        </View>
                                    )
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
            </View>
        </View>

    )
}

export default Documents