import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../../../constants/theme';
import DismissalCard from '../../../components/Card/DismissalCard';
import { useNavigation } from '@react-navigation/native';
import Cardstyle4 from '../../../components/Card/Cardstyle4';
import { IMAGES } from '../../../constants/Images';

const DismissalHome = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [documentStatus, setDocumentStatus] = useState<string | null>(null);
  const { width, height } = Dimensions.get("window");

  const handleDocumentUpload = () => {
    navigation.navigate('Camera', {
      documentType: 'dismissal_letter',
      twoPicture: false,
      returnScreen: 'DismissalHome'
    });
  };

  const documentData = {
    DocumentName: "Carta a punho",
    sendDocument: true,
    typeDocument: "dismissal_letter",
    statusDocument: documentStatus,
    twoPicture: false,
    path: null,
    jobId: 0
  };

  return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
      >
        <View className="px-5 mt-14">
          <View className="flex-row items-center mb-5">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Text 
                  style={{ ...FONTS.fontMedium, fontSize: 20, lineHeight: 20 }}
                  className="text-center"
                >
                  ←
                </Text>
              </View>
            </TouchableOpacity>
            
            <Text 
              className="text-2xl font-semibold text-gray-900 dark:text-white flex-1 text-center -ml-10"
              style={FONTS.fontSemiBold}
            >
              Solicitação de Demissão
            </Text>
          </View>

          <View className={`p-3 mt-5`}>
            <View className={`mt-16 bg-primary w-full p-3 rounded-xl flex-row justify-between`}>
              <View className={`w-2/4`}>
                <Text
                  className={`absolute w-44`}
                  style={{
                      ...FONTS.fontSemiBold,
                      fontSize: 24,
                      color: '#000000',
                      marginTop: -38,
                    }}
                >
                  Documentação
                </Text>
                <Text
                  className={`mt-2`}
                  style={{ ...FONTS.fontRegular, fontSize: 14 }}
                >
                  Envie sua carta de demissão para iniciar o processo
                </Text>
              </View>
              <View className={`w-2/4`}>
                <Image
                  source={IMAGES.unique14}
                  style={{
                      height: height * 0.3,
                    width: width * 0.5,
                    resizeMode: "contain",
                    marginTop: -120,
                  }}
                />
              </View>
            </View>
          </View>

          <View style={{ marginTop: 50 }}>
            <View className={`px-2`}>
              <View style={{ marginBottom: 30 }}>
                <Cardstyle4
                  documentName={documentData.DocumentName}
                  sendDocument={documentData.sendDocument}
                  typeDocument={documentData.typeDocument}
                  statusDocument={documentData.statusDocument}
                  twoPicture={documentData.twoPicture}
                  path={documentData.path}
                  jobId={documentData.jobId}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-red-500 p-4 rounded-lg items-center mt-32"
            activeOpacity={0.8}
            disabled={!documentStatus || documentStatus === 'reproved'}
            onPress={handleDocumentUpload}
          >
            <Text className="text-white font-semibold" style={FONTS.fontSemiBold}>
              Confirmar Solicitação
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DismissalHome;
