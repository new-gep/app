import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet,TouchableOpacity, TextInput } from 'react-native'
import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from "@react-navigation/native";
import { rf } from "~/src/hooks/utils/responsiveFont";


type props = {
    code : any,
    setCode :any ,
    maximumLength :any,
    setIsPinReady:any,
}

const OTPInput = ({code,setCode,maximumLength,setIsPinReady} : props) => {
    

    const boxArray = new Array(maximumLength).fill(0);

    const inputRef = useRef<any>();

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    const boxDigit = (_:any, index:any) => {
        const emptyInput = "";
        const digit = code[index] || emptyInput;

        const isCurrentDigit = index === code.length;
        const isLastDigit = index === maximumLength - 1;
        const isCodeFull = code.length === maximumLength;
        
        const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        return (
            <View  key={index} style={[styles.SplitBoxes, isDigitFocused ? styles.SplitBoxesFocused : null]}>
                <Text style={[FONTS.fontLight,styles.SplitBoxText,{color:colors.title}]}>{digit}</Text>
            </View>
        );
    };


    const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

    const handleOnPress = () => {
        setIsInputBoxFocused(true);
        inputRef.current.focus();
    };
     
    const handleOnBlur = () => {
        setIsInputBoxFocused(false);
    };     

    useEffect(()=>{

    },[code])

  return (
    <View style={styles.OTPInputContainer}>
        <TouchableOpacity style={styles.SplitOTPBoxesContainer} onPress={ handleOnPress }>
            {boxArray.map(boxDigit)}
        </TouchableOpacity>
        <TextInput 
            style={styles.TextInputHidden}
            value={code}
            onChangeText={setCode}
            maxLength={maximumLength}
            ref={inputRef}
            // onFocus={handleOnPress}
            onBlur={handleOnBlur}
            keyboardType={'default'}
        />
    </View>
  )
}


const styles = StyleSheet.create({
    OTPInputContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    TextInputHidden: {
        // width:300,
        // borderWidth:1,
        // borderColor:'#e5e5e5',
        // borderRadius:5,
        // padding:15,
        position:'absolute',
        opacity:0
    },
    SplitOTPBoxesContainer :{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-evenly',
        //padding:20,
        paddingTop:rf(20),
        gap:5,
        paddingHorizontal:rf(40)
        //height:20
    },
    SplitBoxes :{
        borderColor:COLORS.inputborder,
        borderBottomWidth:2,
        width:rf(55),
        //padding:15,
        height:rf(55),
        alignItems:'center',
        justifyContent:'center',
    },
    SplitBoxText :{
        fontSize:rf(28),
        textAlign:'center',
        color:'#000'
    },
    SplitBoxesFocused:{
        //borderBottomWidth:2,
        borderColor:COLORS.primary,
        shadowColor:COLORS.primaryLight,
        //elevation:1
    
        // height:60,
        // alignItems:'center',
        // justifyContent:'center',
        //width:48
        //backgroundColor: 'red'
        
    }
});
export default OTPInput