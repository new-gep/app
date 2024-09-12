import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';


export default async function GetPathPicture(option:string){

    if(option === 'gallery'){
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });
        return result.assets[0].uri
    };

    if(option === 'camera'){
        const options = {
            allowsEditing: true, 
        };
        try{
            const result = await ImagePicker.launchCameraAsync(options);
            if (!result.assets.cancelled) {
                return result.assets[0].uri
            }
        }catch(e){
            return 'cancel'
        }
    };

    if(option === 'file'){
            const result = await DocumentPicker.getDocumentAsync({});
            const { mimeType, uri, size } = result.assets[0];
            if (mimeType === 'application/pdf' && size <= 1024 * 1024) {
                return uri;
            }
            return {
                option: 'file',
                error : 'option no is pdf or size forbidden'
            };
    };
    
}

