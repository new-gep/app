import React, { useEffect, useState } from 'react';
import { useCollaboratorContext  } from '../../context/CollaboratorContext';
import ProfileCompletionModal from '../../components/Modal/ProfileLock';
import DocumentCompletionModal from '../../components/Modal/DocumentLock';
const ValidateCollaboratorAndBlock = () => {
    const { validateCollaborator, missingData } = useCollaboratorContext ();
    const [modalFieldsVisible, setModalFieldsVisible] = useState(false);
    const [modalDocumentsVisible, setModalDocumentsVisible] = useState(false);

    // Sempre que os dados faltantes forem atualizados, verificamos se o modal deve aparecer
    useEffect(() => {
        if (missingData) {
            if (missingData.missingFields && missingData.missingFields.length > 0) {
                setModalFieldsVisible(true); // Exibe o modal para os campos faltantes
            } else 
            if (missingData.missingDocuments && missingData.missingDocuments.length > 0) {
                setModalDocumentsVisible(true); // Exibe o modal para os documentos faltantes
            } else {
                setModalFieldsVisible(false);
                setModalDocumentsVisible(false);
            }
        }
    }, [missingData]);

    // Função para fechar o modal
    const handleCloseFieldsModal = () => {
        setModalFieldsVisible(false);
    };

    // Função para fechar o modal de documentos faltantes
    const handleCloseDocumentsModal = () => {
        setModalDocumentsVisible(false);
    };

    return (
        <>
            <ProfileCompletionModal 
                visible={modalFieldsVisible} 
                close={handleCloseFieldsModal} 
            />

            <DocumentCompletionModal
                visible={modalDocumentsVisible}
                close={handleCloseDocumentsModal}
            />
        
        </>
    );
};

export default ValidateCollaboratorAndBlock;
