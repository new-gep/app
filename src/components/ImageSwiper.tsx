import React, { useState } from 'react';
import { View, Image, useWindowDimensions,TouchableOpacity, Text } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import DevelopmentModal from './Modal/Development';

const ImageSwiper = ({ data } : any) => {
  const [isShowDevelopment,setIsShowDevelopment] = useState<boolean>(false)
  const [newData] = useState([
    { key: 'space-left' },
    ...data,
    { key: 'space-right' },
  ]);
  
  const { width } = useWindowDimensions();
  const SIZE = width * 0.7; // Aumentei o tamanho do card para melhor visualização
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);

  const onScroll = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
      x.value = event.nativeEvent.contentOffset.x;
  };

  const navigation = useNavigation<any>();

  const closeDevelopment = () => {
    setIsShowDevelopment(false)
  }
  
  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}
      snapToInterval={SIZE}
      decelerationRate="fast"
      onScroll={onScroll}
      contentContainerStyle={{
     // Adicionei padding horizontal para centralizar
        paddingTop: 25,
        paddingBottom: 10
      }}
    >
      {newData.map((item, index) => {
        
        const style = useAnimatedStyle(() => {
          const scale = interpolate(
            x.value,
            [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
            [0.8, 1, 0.8]
            );
            return {
              transform: [
                { scale },
              ],
            };
        });
          
        if (!item.image) {
          return <View style={{ width: SPACER}} key={index} />;
        }

        return (
          <View key={index} style={{ width: SIZE, justifyContent: 'center', alignItems: 'center' }}>
            {/* <DevelopmentModal close={closeDevelopment} visible={isShowDevelopment}/> */}
            <Animated.View style={[style, { width: '100%', alignItems: 'center' }]}>
              <TouchableOpacity
                activeOpacity={.9}
                onPress={() => navigation.navigate(item.route, {
                  ...(item.params || {}),
                  jobConected: item.params?.jobConected,
                  CPF: item.params?.CPF
                })}
                style={{ 
                  height: 352, 
                  width: '90%', 
                  backgroundColor: COLORS.primary, 
                  borderRadius: 31,
                  shadowColor: "#025135",
                  shadowOffset: {
                    width: 0,
                    height: 15,
                  },
                  shadowOpacity: 0.34 ,
                  shadowRadius : 31.27,
                  elevation    : 8
                }}
              >
                <View style={{alignItems:'center'}}>
                  <Image
                    style={{ height:210,width:210,resizeMode:'contain'}}
                    source={item.image}
                  />
                </View>
                <View style={{paddingHorizontal:25}}>
                  <Text style={{...FONTS.fontSemiBold,fontSize:20,color:COLORS.dark,}}>{item.title}</Text>
                  <View style={{flexDirection:'row',alignItems:'flex-start',gap:5,marginTop:10}}>
                      <Text style={{...FONTS.fontMedium,fontSize:15,color:COLORS.dark,}}>{item.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        );
      })}
    </Animated.ScrollView>
  );
};

export default ImageSwiper;
