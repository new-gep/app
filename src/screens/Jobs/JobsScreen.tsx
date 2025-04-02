import React from 'react';
import { View } from 'react-native';
import { JobCard } from '../../components/JobCard';

export const JobsScreen = () => {
  const handleApply = (jobId: string) => {
    // Implementar a lógica de candidatura aqui
    console.log(`Candidatura enviada para vaga ${jobId}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <JobCard 
        job={{
          id: '1',
          title: 'Desenvolvedor React Native',
          company: 'Empresa XYZ',
          description: 'Vaga para desenvolvedor React Native com experiência...'
        }}
        onApply={handleApply}
      />
    </View>
  );
}; 