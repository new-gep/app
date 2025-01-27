const AdmissionalDocument: React.FC = () => {
  // ... código existente ...

  return (
    <>
      <WaitingIndicator 
        visible={isLoading} 
        status={signatureFound?.status}
      />
      
      {/* ... resto do seu código ... */}
    </>
  );
};
