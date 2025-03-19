import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const JobApplicationCard = ({ job, company }) => {
  const navigation = useNavigation();

  const calculateDaysAgo = (createDate: string) => {
    const created = new Date(createDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    console.log('company', company);
  }, [company]);


  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('CardInformation', { cardData: job})}
      style={[styles.card, {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }]}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{job.function}</Text>
        {/* <Text style={styles.subtitle}>{job.work_mode || 'Presencial'}</Text> */}
        <Text style={styles.subtitle}>
          {job.company ? `${job.company.city || ''}, ${job.company.uf || ''}` : 'Localização não informada'}
        </Text>
        <Text style={styles.salary}>
          {job.salary ? `R$ ${job.salary} por mês` : 'R$ 8.000 por mês'}
        </Text>
        <Text style={styles.dateInfo}>
          {`Publicado há ${calculateDaysAgo(job.create_at)} dias`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  salary: {
    fontSize: 14,
    color: '#111827',
    marginTop: 4,
  },
  dateInfo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

export default JobApplicationCard; 