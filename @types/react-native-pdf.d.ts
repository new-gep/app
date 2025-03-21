declare module 'react-native-pdf' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';

    interface PdfProps {
        source: { uri: string; cache?: boolean };
        onLoadComplete?: (numberOfPages: number, filePath: string) => void;
        onPageChanged?: (page: number, numberOfPages: number) => void;
        onError?: (error: any) => void;
        onPressLink?: (uri: string) => void;
        style?: ViewStyle;
        // Adicione outras props conforme necessário
    }

    export default class Pdf extends Component<PdfProps> {}
} 