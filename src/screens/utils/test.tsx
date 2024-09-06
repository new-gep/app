import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

const PdfViewer = () => {
    const [pdfUri, setPdfUri] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Função para baixar o PDF
        const downloadPdf = async () => {
            try {
                const uri = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                const fileUri = `${FileSystem.documentDirectory}dummy.pdf`; // Armazena o PDF localmente

                const { exists } = await FileSystem.getInfoAsync(fileUri);

                if (!exists) {
                    console.log('Baixando PDF...');
                    const download = await FileSystem.downloadAsync(uri, fileUri);
                    setPdfUri(download.uri);
                } else {
                    setPdfUri(fileUri); // Usa o PDF localmente se já estiver disponível
                }

                setLoading(false);
            } catch (error) {
                console.log('Erro ao baixar PDF', error);
                setLoading(false);
            }
        };

        downloadPdf();
    }, []);

    return (
        <View style={styles.container}>
            {loading && (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            )}
            {pdfUri && (
                <WebView
                    source={{ uri: pdfUri }}
                    style={styles.webview}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        console.log('Erro ao carregar PDF');
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webview: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
});

export default PdfViewer;
