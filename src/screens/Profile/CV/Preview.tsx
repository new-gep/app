import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PersonalInfoPreview from './helper/PersonalInfoPreview';
import EducationPreview from './helper/EducationPreview';
import ExperiencePreview from './helper/ExperiencePreview';
import SkillsPreview from './helper/SkillsPreview';

const CVPreview = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({ name: '', title: '', contact: '', employed: '', dob: '', cpf: '', educationLevel: '', experienceYears: '', sector: '' });
  const [education, setEducation] = useState([{ degree: '', institution: '', period: '', dissertation: '' }]);
  const [experience, setExperience] = useState([{ role: '', company: '', period: '', responsibilities: '' }]);
  const [skills, setSkills] = useState(['']);

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  return (
    <View className="bg-primary p-4 rounded-lg mb-4">
      {!showPreview ? (
        <TouchableOpacity onPress={handlePreview} className="bg-black p-2 rounded-lg">
          <Text className="text-primary text-center">Gerar Currículo</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <PersonalInfoPreview data={personalInfo} />
          <EducationPreview data={education} />
          <ExperiencePreview data={experience} />
          <SkillsPreview data={skills} />
          <TouchableOpacity onPress={handleBack} className="bg-black p-2 rounded-lg mt-2">
            <Text className="text-primary text-center">Voltar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CVPreview;