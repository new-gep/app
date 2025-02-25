import React from 'react';
import Cardstyle4 from './Cardstyle4';

interface DocumentCardProps {
    documentName: string;
    sendDocument: boolean;
    typeDocument: string;
    statusDocument: string | null;
    twoPicture: boolean;
    path: any;
    jobId: number;
}

const DocumentCard = (props: DocumentCardProps) => {
    return <Cardstyle4  {...props} />;
};

export default DocumentCard; 