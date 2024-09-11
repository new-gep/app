import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import WebView from "react-native-webview";
import * as FileSystem from 'expo-file-system';

type TypePictureProps = {
    CNH: string | null;
    RG: string  | null;
    Work_Card: string | null;
    Address: string | null;
    School_History: string | null;
    Marriage_Certificate: string | null;
    Birth_Certificate: string[] | null;
};

type Props = {
    typeDocument: string;
    twoPicture: boolean;
    visible: boolean;
    path?: any
    documentName:string
    setTypeDocument: React.Dispatch<React.SetStateAction<TypePictureProps>>;
    close: () => void;
};

const DocumentVisible = ({ setTypeDocument, documentName, path, twoPicture, typeDocument, visible, close }: Props) => {
    // Define qual lado da imagem está sendo visualizado ou se deve mostrar as opções
    const [viewingSide, setViewingSide] = useState<'front' | 'back' | null>(null);
    const [loading, setLoading] = useState(true);
    const [pathFront, setPathFront] = useState<any>()
    const [pathBack , setPathBack]  = useState<any>()
    const [pathOne , setPathOne]    = useState<any>()

    const loadPdfBase64 = async (pdfPath:any) => {
        const pdfBase64 = await FileSystem.readAsStringAsync(pdfPath, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return `${pdfBase64}`;
    };
    
    useEffect(()=>{
        const fetchData = async () => {
            if(path){
                if(path.length > 1){
                    const pathImageFront = await loadPdfBase64(path[0]);
                    const pathImageBack  = await loadPdfBase64(path[1]);
                    setPathFront(pathImageFront)
                    setPathBack(pathImageBack)
                }else{
                    const pathImage = await loadPdfBase64(path)
                    setPathOne(pathImage)
                }
            }
        }
        fetchData()
    },[])
    
    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={300}
            animationOutTiming={300}
            backdropOpacity={0.8}
            useNativeDriver={true}
            onBackdropPress={close}
            className={`justify-end p-0 m-0 `}
        >
            <View>
                {typeDocument === 'picture' ? (
                    <>
                        {!twoPicture && (
                            <Image 
                                className="w-full h-full object-contain" 
                                source={{ uri: path }}
                            />
                        )}
                        {twoPicture && !viewingSide? (
                            <View className="items-center w-full bg-white rounded-t-3xl p-4">
                                <View className="w-full items-center justify-center mb-5 ">
                                    <View className="w-1/12 bg-neutral-400 rounded-xl h-1" />
                                </View>
                                <View className={`w-full`} >
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16}}>Visualização</Text>
                                </View>
                                <TouchableOpacity
                                    className="w-1/2 mb-4 mt-4 p-2.5 bg-primary rounded-lg"
                                    onPress={() => setViewingSide('front')}
                                >
                                    <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Frente</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-2.5 bg-primary rounded-lg w-1/2"
                                    onPress={() => setViewingSide('back')}
                                >
                                    <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Verso</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                {/* Exibe a imagem da frente ou verso com base no estado */}
                                {viewingSide === 'front' && (
                                    <Image className="w-full h-full object-contain" source={{ uri: `data:application/pdf;base64,${pathFront}` }}/>
                                )}
                                {viewingSide === 'back'  && (
                                    <Image className="w-full h-full object-contain" source={{ uri: `data:application/pdf;base64,${pathBack}` }}/>
                                )}

                                {/* Botão para fechar ou voltar para escolher frente/verso */}
                                <TouchableOpacity
                                    className="absolute top-5 right-5 bg-primary p-2 rounded-lg w-8 h-8 itens-center" 
                                    onPress={() => twoPicture ? setViewingSide(null) : close()}
                                    
                                >
                                    <Image 
                                        source={IMAGES.close}
                                        className={`w-full h-full`}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                ) : (
                    // Exibição do PDF (placeholder, você pode usar um componente de visualização de PDF real aqui)
                    <View className={`w-full h-full`}>

                            <WebView
                                source={{uri: 'https://docs.google.com/gview?embedded=true&url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }}
                                    className="w-full h-full " 
                                    onError={() => console.log('Erro ao carregar PDF')}
                               
                             />
                        
                        <TouchableOpacity
                            className="absolute top-5 right-5 bg-primary p-2 rounded-lg w-8 h-8 itens-center" 
                            onPress={() => twoPicture ? typeDocument === 'picture'  ? setViewingSide(null) : close() : close()}    
                        >
                            <Image 
                                source={IMAGES.close}
                                className={`w-full h-full`}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                            
                    </View>
                )}
            </View>
        </Modal>
    );
};



export default DocumentVisible;
