import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PinInputProps {
    pin: string;
    onPress: (digit: string) => void;
    onDelete: () => void;
    onBiometric?: () => void;
    error?: boolean;
    title?: string;
    subtitle?: string;
    maxLength?: number;
    showBiometric?: boolean;
}

export default function PinInput({
    pin,
    onPress,
    onDelete,
    onBiometric,
    error = false,
    title = 'PIN Giriniz',
    subtitle,
    maxLength = 4,
    showBiometric = false,
}: PinInputProps) {
    const colors = useThemeColors();
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (error) {
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
        }
    }, [error, shakeAnim]);

    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}

            {/* PIN Dots */}
            <Animated.View style={[styles.dots, { transform: [{ translateX: shakeAnim }] }]}>
                {Array.from({ length: maxLength }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: i < pin.length ? colors.pinDotFilled : colors.pinDot,
                                transform: [{ scale: i < pin.length ? 1.2 : 1 }],
                            },
                        ]}
                    />
                ))}
            </Animated.View>

            {error && (
                <Text style={[styles.errorText, { color: colors.danger }]}>
                    Yanlış PIN. Tekrar deneyin.
                </Text>
            )}

            {/* Keypad */}
            <View style={styles.keypad}>
                {digits.map((digit, index) => {
                    if (digit === '') {
                        if (showBiometric && onBiometric) {
                            return (
                                <TouchableOpacity
                                    key="biometric"
                                    onPress={onBiometric}
                                    style={[styles.key, { backgroundColor: 'transparent' }]}
                                    activeOpacity={0.6}
                                >
                                    <Ionicons name="finger-print" size={30} color={colors.primary} />
                                </TouchableOpacity>
                            );
                        }
                        return <View key={`empty-${index}`} style={styles.key} />;
                    }

                    if (digit === 'del') {
                        return (
                            <TouchableOpacity
                                key="del"
                                onPress={onDelete}
                                onLongPress={() => {
                                    // Clear all
                                    for (let i = 0; i < maxLength; i++) onDelete();
                                }}
                                style={[styles.key, { backgroundColor: 'transparent' }]}
                                activeOpacity={0.6}
                            >
                                <Ionicons name="backspace-outline" size={28} color={colors.text} />
                            </TouchableOpacity>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={digit}
                            onPress={() => onPress(digit)}
                            style={[styles.key, { backgroundColor: colors.pinKey }]}
                            activeOpacity={0.6}
                        >
                            <Text style={[styles.keyText, { color: colors.text }]}>{digit}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xxxl,
    },
    title: {
        ...Typography.title2,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.subheadline,
        marginBottom: Spacing.xxl,
        textAlign: 'center',
    },
    dots: {
        flexDirection: 'row',
        gap: Spacing.lg,
        marginBottom: Spacing.xxl,
        marginTop: Spacing.lg,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    errorText: {
        ...Typography.footnote,
        marginBottom: Spacing.lg,
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 280,
        gap: Spacing.md,
    },
    key: {
        width: 72,
        height: 72,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyText: {
        ...Typography.title1,
        fontWeight: '400',
    },
});
