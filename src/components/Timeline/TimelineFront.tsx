import React from 'react';
import { View, Text } from 'react-native';

type TimelineProps = {
  currentStep: number;
  showProgress?: boolean;
  status?: 'pending' | 'approved';
};

const TimelineFront: React.FC<TimelineProps> = ({ currentStep, showProgress = true, status }) => {
  const steps = [
    { id: 1, label: 'Exame\nAdmissional' },
    { id: 2, label: 'Kit\nAdmissional' },
    { id: 3, label: 'Assinatura\n' }
  ];

  // Função auxiliar para determinar a cor com base no status
  const getColor = (stepId: number) => {
    if (status === 'pending') return 'bg-yellow-500 border-yellow-500';
    return currentStep > stepId 
      ? 'bg-primary border-primary'
      : currentStep === stepId
      ? 'bg-primary border-primary border-[3px]'
      : 'bg-white border-gray-300';
  };

  return (
    <View className="px-4 py-4">
      <View className="flex-row items-center relative mb-6">
        {/* Linha de fundo contínua */}
        <View 
          className="absolute h-[1px] bg-gray-300 top-[10px]" 
          style={{
            width: '80%',
            left: '10%',
          }}
        />
        
        {steps.map((step, index) => (
          <View 
            key={step.id} 
            className="flex-1 items-center"
            style={{ 
              paddingLeft: index === 0 ? 0 : index === 1 ? 20 : 40,
              paddingRight: index === 2 ? 0 : index === 1 ? 20 : 40,
            }}
          >
            {/* Círculo e texto */}
            <View className="items-center">
              <View 
                className={`w-5 h-5 rounded-full border-2 ${getColor(step.id)}`}
              />
              <Text 
                className={`text-xs mt-4 text-center ${
                  currentStep >= step.id ? 'text-dark' : 'text-gray-500'
                }`}
              >
                {step.label}
              </Text>
            </View>

            {/* Linha colorida de progresso - ajustada para incluir estado amarelo */}
            {showProgress && index < 2 && currentStep > step.id && (
              <View 
                className={`absolute h-[1px] ${status === 'pending' ? 'bg-yellow-500' : 'bg-primary'} top-[10px]`}
                style={{
                  width: index === 0 && currentStep === 3 ? '330%' : '200%',
                  left: '50%',
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default TimelineFront; 