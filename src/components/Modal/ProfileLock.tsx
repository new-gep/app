import React from 'react';
import { Text, View , Image, Dimensions} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Modal from "react-native-modal";
import Button from '../Button/Button';
import { COLORS, FONTS } from '../../constants/theme';
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { IMAGES } from '../../constants/Images';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const images = [
    IMAGES.completeProfile1,
    IMAGES.completeProfile2,
    IMAGES.completeProfile3,
];
type Props = {
    visible: boolean;
    close: () => void;
}

const ProfileCompletionModal = ({ visible, close }: Props) => {
    const navigation = useNavigation<RootStackParamList>();

    const handleClick = async () => {
        const collaborator = await AsyncStorage.getItem('collaborator')
        close();
        if(collaborator){
            navigation.navigate('Profile');
        }
    }

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={300}
            animationOutTiming={300}
            backdropOpacity={0.8} // Opacidade do fundo
            useNativeDriver={true} // Melhor performance na animação
            className={`justify-end p-0 m-0 `}
        >
            <View className="w-full">
                <View className="items-center w-full  bg-white rounded-t-3xl ">
                    <View className={`w-full items-center justify-center mb-2 mt-2`}>
                        <View className={`w-1/12 bg-neutral-400 rounded-xl h-1`}>
                        </View>
                    </View>
                    <View className={`py-5 items-center w-full`}>
                        <Text style={{...FONTS.fontRegular,}} className="text-xl font-bold text-dark mb-2">Acompanhe seu Perfil</Text>
                        <View className={`w-52 h-52 my-3`}>
                             <Carousel
                                enabled={false}
                                loop
                                width={200}
                                height={200}
                                autoPlay={true}
                                data={images}
                                autoPlayInterval={5000}
                                scrollAnimationDuration={1000}
                                renderItem={({ item }) => (
                                    <Image
                                        source={item}
                                        style={{ width: '100%', height:'100%' }}
                                    />
                                )}
                            />
                        </View>
                        <Text style={{...FONTS.fontRegular,}} className="text-center text-base text-gray-500 dark:text-gray-300 px-2">
                            Complete seu cadastro e aguarde a avaliação para continuar utilizando o aplicativo.
                        </Text>
                        <View className="flex-row mt-6">
                            <Button
                                onPress={handleClick}
                                text={COLORS.dark}
                                title="Verificar Perfil"
                                bg="bg-primary"
                                style={{ borderRadius: 50 }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ProfileCompletionModal;
