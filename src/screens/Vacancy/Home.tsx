import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, Dimensions } from 'react-native';
import Button from '../../components/Button/Button';
import JobApplicationCard from '../../components/Card/JobApplicationCard';
import { FONTS, COLORS } from '../../constants/theme';
import Header from '../../layout/Header';
const { width, height } = Dimensions.get('window');

import { useNavigation } from '@react-navigation/native';
export default function Vacancy() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobConected, setJobConected] = useState([]); // Substitua por seus dados reais
  
  // const filteredJobs = jobConected.filter((job:any) => 
  //   job.title?.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <>
      <Header
        title='Vagas Cadastradas'
        leftIcon={'back'}
        iconSimple={'archive'}        
      />

      {/* Search */}
      { jobConected && jobConected.length > 0 &&
        <View className="px-4 mt-4">
          <TextInput
            placeholder="Buscar vaga..."
            placeholderTextColor="#9CA3AF"
            className="p-3 border border-gray-300 rounded-lg text-gray-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      }

      <View className="mt-5 flex justify-between items-center h-full">
        {jobConected && jobConected.length > 0 ? (
          <ScrollView 
            style={{ width: '100%' }}
            showsVerticalScrollIndicator={false}
          >
            {jobConected?.length > 0 ? (
              jobConected.map((job:any) => (
                <JobApplicationCard key={job.id} job={job} company={job.company}/>
              ))
            ) : (
              <View className="py-20 items-center justify-center">
                <Text className="text-lg text-gray-500 font-semibold">
                  Não há uma vaga com este nome
                </Text>
                <Text className="text-gray-400 mt-2 text-center px-8">
                  Tente buscar com outro termo
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View
            className="items-center justify-center"
          >
            <Text
              style={{
                ...FONTS.fontSemiBold,
                fontSize: 16,
                color: COLORS.title,
                marginBottom: 5,
                marginTop: 40,
              }}
            >
              Sem vagas cadastradas
            </Text>
            <Text className="text-center text-sm text-gray-400 font-normal">
              Não se cadastrou em nenhuma vaga até o momento
            </Text>

            <Image
              source={require("../../assets/images/brand/Business-nojob.png")}
              style={{ width: width * 0.7, height: height * 0.5 }}
              resizeMode="contain"
            />

            <Button 
              title={"Ver Vagas"}
              onPress={() => navigation.navigate('Home')}
              text={COLORS.title}
              color={COLORS.primary}
              style={{borderRadius: 52, width: width * 0.7}}
            />
          </View>
        )}
      </View>
    </>
  );
};