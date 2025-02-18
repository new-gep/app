// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
// import { useTheme } from '@react-navigation/native';
// import { FONTS } from '../../constants/theme';
// import { useNavigation } from '@react-navigation/native';
// import Cardstyle4 from '../../components/Card/Cardstyle4';
// import { IMAGES } from '../../constants/Images';

// const Absence = () => {
//   const theme = useTheme();
//   const navigation = useNavigation<any>();
//   const [documentStatus, setDocumentStatus] = useState<string | null>(null);
//   const { width, height } = Dimensions.get("window");
//   const [selectedReason, setSelectedReason] = useState<string | null>(null);
//   const [showOptions, setShowOptions] = useState(false);
//   const [otherReason, setOtherReason] = useState('');

//   const handleDocumentUpload = () => {
//     navigation.navigate('Camera', {
//       documentType: 'absence_justification',
//       twoPicture: false,
//       returnScreen: 'Absence'
//     });
//   };

//   const handleSelectReason = (reason: string) => {
//     setSelectedReason(reason);
//     setShowOptions(false);
//     if(reason !== 'Outros') setOtherReason('');
//   };

//   return (
//     <View className="flex-1 bg-white dark:bg-gray-900">
//       <ScrollView 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
//       >
//         <View className="px-5 mt-14">
//           <View className="flex-row items-center mb-5">
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
//                 <Text 
//                   style={{ ...FONTS.fontMedium, fontSize: 20, lineHeight: 20 }}
//                   className="text-center"
//                 >
//                   ←
//                 </Text>
//               </View>
//             </TouchableOpacity>
            
//             <Text 
//               className="text-2xl font-semibold text-gray-900 dark:text-white flex-1 text-center -ml-10"
//               style={FONTS.fontSemiBold}
//             >
//               Justificar Ausência
//             </Text>
//           </View>

//           {/* Seletor de Motivo */}
//           <View className="mt-8">
//             <Text className="text-gray-900 dark:text-white mb-2" style={FONTS.fontSemiBold}>
//               Selecione o motivo da ausência:
//             </Text>
            
//             <TouchableOpacity
//               onPress={() => setShowOptions(!showOptions)}
//               className="p-4 border border-gray-300 rounded-lg dark:border-gray-600"
//             >
//               <Text className="text-gray-900 dark:text-white">
//                 {selectedReason || 'Selecione uma opção'}
//               </Text>
//             </TouchableOpacity>

//             {showOptions && (
//               <View className="mt-2 border border-gray-300 rounded-lg dark:border-gray-600">
//                 <TouchableOpacity
//                   className="p-3 border-b border-gray-300 dark:border-gray-600"
//                   onPress={() => handleSelectReason('Minha saúde')}
//                 >
//                   <Text className="text-gray-900 dark:text-white">Minha saúde</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className="p-3 border-b border-gray-300 dark:border-gray-600"
//                   onPress={() => handleSelectReason('Acompanhante saúde')}
//                 >
//                   <Text className="text-gray-900 dark:text-white">Acompanhante saúde</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className="p-3"
//                   onPress={() => handleSelectReason('Outros')}
//                 >
//                   <Text className="text-gray-900 dark:text-white">Outros</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {selectedReason === 'Outros' && (
//               <TextInput
//                 placeholder="Digite o motivo"
//                 placeholderTextColor={theme.dark ? '#fff' : '#000'}
//                 className="p-4 border border-gray-300 rounded-lg mt-4 text-gray-900 dark:text-white dark:border-gray-600"
//                 value={otherReason}
//                 onChangeText={setOtherReason}
//                 style={{ color: theme.colors.text }}
//                 multiline
//               />
//             )}
//           </View>

//           {/* Imagem isolada quando não há seleção */}
//           {!selectedReason && (
//             <Image
//               source={IMAGES.unique14}
//               style={{
//                 height: height * 0.4,
//                 width: width * 0.8,
//                 resizeMode: "contain",
//                 marginTop: 40,
//                 alignSelf: 'center',
//                 opacity: 0.8
//               }}
//             />
//           )}

//           {/* Seção de documentação com imagem + Card (aparece apenas com motivo selecionado) */}
//           {selectedReason && (
//             <View style={{ marginTop: 30 }}>
//               {/* Seção com imagem */}
//               <View className={`p-3`}>
//                 <View className={`bg-primary w-full p-3 rounded-xl flex-row justify-between`}>
//                   <View className={`w-2/4`}>
//                     <Text
//                       className={`absolute w-44`}
//                       style={{
//                         ...FONTS.fontSemiBold,
//                         fontSize: 22,
//                         color: '#000000',
//                         marginTop: -38,
//                       }}
//                     >
//                       Documentação
//                     </Text>
//                     <Text
//                       className={`mt-2`}
//                       style={{ ...FONTS.fontRegular, fontSize: 14 }}
//                     >
//                       Envie seu documento para análise
//                     </Text>
//                   </View>
//                   <View className={`w-2/4`}>
//                     <Image
//                       source={IMAGES.unique14}
//                       style={{
//                         height: height * 0.3,
//                         width: width * 0.5,
//                         resizeMode: "contain",
//                         marginTop: -120,
//                       }}
//                     />
//                   </View>
//                 </View>
//               </View>

//               {/* Card de upload de documento */}
//               <View className={`px-2 mt-8`}>
//                 <Cardstyle4
//                   documentName={
//                     selectedReason === 'Outros' && otherReason 
//                       ? otherReason 
//                       : selectedReason
//                   }
//                   sendDocument={true}
//                   typeDocument="absence_justification"
//                   statusDocument={documentStatus}
//                   twoPicture={false}
//                   path={null}
//                   jobId={0}
//                 />
//               </View>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default Absence;