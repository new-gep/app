import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { COLORS, FONTS } from '../../constants/theme';

type Props = {
    active: boolean; // Corrigido para "boolean" no lugar de "Boolean"
    setActive: (value: boolean) => void;
}

const ToggleStyle3 = ({ active, setActive }: Props) => {
    const { colors } = useTheme();

    // Define o offset inicial com base no valor de "active"
    const offset = useSharedValue(active ? 28 : 0);

    const toggleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: offset.value,
                },
            ],
        };
    });

    useEffect(() => {
        // Atualiza o offset quando o valor de active muda
        offset.value = active ? withSpring(28) : withSpring(0);
    }, [active]);

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    setActive(!active);
                    if (active) {
                        offset.value = withSpring(0);
                    } else {
                        offset.value = withSpring(28);
                    }
                }}
                style={[{
                    height: 32,
                    width: 65,
                    backgroundColor: active ? COLORS.success : COLORS.danger,
                }]}
                className={`rounded-3xl`}
            >
                <View
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 4,
                        justifyContent: 'space-around',
                    }}
                >
                    <Text style={{ ...FONTS.font, ...FONTS.fontMedium, fontSize: 10, color: COLORS.white }}>SIM</Text>
                    <Text style={{ ...FONTS.font, ...FONTS.fontMedium, fontSize: 10, color: COLORS.white }}>NÃO</Text>
                </View>
                <Animated.View
                    style={[toggleStyle, {
                        height: 23,
                        width: 25,
                        backgroundColor: '#fff',
                        top: 4,
                        left: 4,
                        right: 4,
                    }]}
                    className={`rounded-3xl`}
                />
            </TouchableOpacity>
        </>
    );
};

export default ToggleStyle3;
