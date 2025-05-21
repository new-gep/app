import Pdf from "react-native-pdf";

export default function CVPDF({path}:any) {
  return (
    <Pdf
      //@ts-ignore
      trustAllCerts={false}
      //@ts-ignore
      enableDoubleTapZoom={true}
      source={{ uri: path, cache: true }}
      onLoadComplete={(numberOfPages, filePath) => {
        // console.log(`Number of pages: ${numberOfPages}`);
      }}
      onPageChanged={(page, numberOfPages) => {
        // console.log(`Current page: ${page}`);
      }}
      onError={(error) => {
        // console.log(error);
      }}
      onPressLink={(uri) => {
        // console.log(`Link pressed: ${uri}`);
      }}
      className="w-full h-full object-contain"
    />
  );
}
