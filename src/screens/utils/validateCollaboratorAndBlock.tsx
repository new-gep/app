import React, { useEffect, useState } from 'react';
import { useCollaboratorContext  } from '../../context/CollaboratorContext';
import ProfileCompletionModal from '../../components/Modal/ProfileLock';
import DocumentCompletionModal from '../../components/Modal/DocumentLock';
import { useNavigation } from '@react-navigation/native';

const ValidateCollaboratorAndBlock = () => {
    const { validateCollaborator, missingData } = useCollaboratorContext ();
    const [modalFieldsVisible, setModalFieldsVisible] = useState(false);
    const [modalDocumentsVisible, setModalDocumentsVisible] = useState(false);

    const navigation = useNavigation();

    // Sempre que os dados faltantes forem atualizados, verificamos se o modal deve aparecer
    useEffect(() => {
        const navigationState = navigation.getState();
        // console.log(navigationState)
        if(true){

            // const currentRoute = navigationState.routes[navigationState.index].state?.routes[navigationState.routes[navigationState.index].state.index]?.name || navigationState.routes[navigationState.index].name;
            if (missingData) {
                // if (missingData.missingFields && missingData.missingFields.length > 0) {
                if (false){
                    // if (currentRoute === 'Profile' || currentRoute === 'EditProfile' || currentRoute === 'SignIn' || currentRoute === 'SignUp' || currentRoute === 'Documents') {
                    //     return
                    // }
                    setModalFieldsVisible(true); // Exibe o modal para os campos faltantes
                } else 
                if (missingData.missingDocuments && missingData.missingDocuments.length > 0) {
                    // if (currentRoute === 'Profile' || currentRoute === 'EditProfile' || currentRoute === 'SignIn' || currentRoute === 'SignUp' || currentRoute === 'Documents' ) {
                    //     return
                    // }
                    setModalDocumentsVisible(true); // Exibe o modal para os documentos faltantes
                } else {
                    setModalFieldsVisible(false);
                    setModalDocumentsVisible(false);
                }
            }
        }else{
            console.log('route não funcionou')
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
            {/* <ProfileCompletionModal 
                visible={modalFieldsVisible} 
                close={handleCloseFieldsModal} 
            /> */}

            <DocumentCompletionModal
                visible={modalDocumentsVisible}
                close={handleCloseDocumentsModal}
            />
        
        </>
    );
};

export default ValidateCollaboratorAndBlock;
