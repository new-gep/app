import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, Dimensions } from 'react-native';
import 
import { Button } from '../components/Button';
import { JobApplicationCard } from '../../../components/JobApplicationCard';
import { FONTS, COLORS } from '../../constants';

const { width, height } = Dimensions.get('window');

export const Vacancy = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobConected, setJobConected] = useState([]); // Substitua por seus dados reais
  
  const filteredJobs = jobConected.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header
        title='Vagas Cadastradas'
        leftIcon={'back'}
        iconSimple={'archive'}        
      />
      <View className="px-4 mt-4">
        <TextInput
          placeholder="Buscar vaga..."
          placeholderTextColor="#9CA3AF"
          className="p-3 border border-gray-300 rounded-lg text-gray-900"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View className="mt-5 flex justify-between items-center h-full">
        {jobConected && jobConected.length > 0 ? (
          <ScrollView 
            style={{ width: '100%' }}
            showsVerticalScrollIndicator={false}
          >
            {filteredJobs?.length > 0 ? (
              filteredJobs.map((job) => (
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
            style={{
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...FONTS.fontSemiBold,
                fontSize: 16,
                color: colors.title,
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