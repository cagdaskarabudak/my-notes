import { BorderRadius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import * as PinService from '@/services/pin-service';
import { getSettings } from '@/services/storage';
import { AppSettings } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const THEME_OPTIONS = [
    { value: 'system' as const, label: 'Sistem', icon: 'phone-portrait-outline' as const, description: 'Cihaz temasını takip et' },
    { value: 'light' as const, label: 'Açık', icon: 'sunny-outline' as const, description: 'Her zaman açık tema' },
    { value: 'dark' as const, label: 'Koyu', icon: 'moon-outline' as const, description: 'Her zaman koyu tema' },
];

export default function SettingsScreen() {
    const colors = useThemeColors();
    const { themePreference, setThemePreference } = useTheme();
    const router = useRouter();
    const [pinEnabled, setPinEnabled] = useState(false);
    const [biometricsAvailable, setBiometricsAvailable] = useState(false);
    const [biometricsEnabled, setBiometricsEnabled] = useState(false);
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [showThemeModal, setShowThemeModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadSettings();
        }, [])
    );

    const loadSettings = async () => {
        const [hasPin, biometric, appSettings] = await Promise.all([
            PinService.hasPin(),
            PinService.isBiometricsAvailable(),
            getSettings(),
        ]);
        setPinEnabled(hasPin);
        setBiometricsAvailable(biometric);
        setSettings(appSettings);
    };

    const handlePinToggle = async (value: boolean) => {
        if (value) {
            router.push({ pathname: '/pin-lock', params: { mode: 'set' } });
        } else {
            // PIN kaldırmadan önce mevcut PIN doğrulaması gerekli
            router.push({ pathname: '/pin-lock', params: { mode: 'verify-disable' } });
        }
    };

    const handleBiometricToggle = async (value: boolean) => {
        if (value) {
            // Etkinleştirmeden önce biyometrik doğrulama testi
            const success = await PinService.authenticateWithBiometrics();
            if (success) {
                setBiometricsEnabled(true);
                Alert.alert('Başarılı', 'Biyometrik doğrulama etkinleştirildi.');
            } else {
                Alert.alert('Başarısız', 'Biyometrik doğrulama yapılamadı. Tekrar deneyin.');
            }
        } else {
            // Kapatmadan önce biyometrik doğrulama gerekli
            const success = await PinService.authenticateWithBiometrics();
            if (success) {
                setBiometricsEnabled(false);
                Alert.alert('Bilgi', 'Biyometrik doğrulama devre dışı bırakıldı.');
            } else {
                Alert.alert('Başarısız', 'Biyometrik doğrulama yapılamadı. Ayar değiştirilemedi.');
            }
        }
    };

    const handleThemeSelect = async (theme: 'light' | 'dark' | 'system') => {
        await setThemePreference(theme);
        setShowThemeModal(false);
    };

    const getThemeLabel = () => {
        const option = THEME_OPTIONS.find((o) => o.value === themePreference);
        return option?.label || 'Sistem';
    };

    const SettingRow = ({
        icon,
        iconColor,
        label,
        subtitle,
        right,
        onPress,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        iconColor?: string;
        label: string;
        subtitle?: string;
        right?: React.ReactNode;
        onPress?: () => void;
    }) => (
        <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.divider }]}
            onPress={onPress}
            activeOpacity={onPress ? 0.6 : 1}
            disabled={!onPress && !right}
        >
            <View style={[styles.settingIcon, { backgroundColor: (iconColor || colors.primary) + '18' }]}>
                <Ionicons name={icon} size={20} color={iconColor || colors.primary} />
            </View>
            <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
                {subtitle && (
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
                )}
            </View>
            {right || (onPress && <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />)}
        </TouchableOpacity>
    );

    return (
        <>
            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
            >
                {/* Security Section */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>GÜVENLİK</Text>
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, ...Shadows.sm }]}>
                    <SettingRow
                        icon="lock-closed"
                        iconColor="#6C5CE7"
                        label="PIN Koruması"
                        subtitle={pinEnabled ? 'Etkin' : 'Devre dışı'}
                        right={
                            <Switch
                                value={pinEnabled}
                                onValueChange={handlePinToggle}
                                trackColor={{ true: colors.primary + '60', false: colors.border }}
                                thumbColor={pinEnabled ? colors.primary : colors.textTertiary}
                            />
                        }
                    />
                    {pinEnabled && (
                        <SettingRow
                            icon="key"
                            iconColor="#e67e22"
                            label="PIN Değiştir"
                            onPress={() => router.push({ pathname: '/pin-lock', params: { mode: 'change' } })}
                        />
                    )}
                    {biometricsAvailable && (
                        <SettingRow
                            icon="finger-print"
                            iconColor="#00B894"
                            label="Biyometrik Doğrulama"
                            subtitle="Parmak izi / Yüz tanıma"
                            right={
                                <Switch
                                    value={biometricsEnabled}
                                    onValueChange={handleBiometricToggle}
                                    trackColor={{ true: '#00B894' + '60', false: colors.border }}
                                    thumbColor={biometricsEnabled ? '#00B894' : colors.textTertiary}
                                />
                            }
                        />
                    )}
                </View>

                {/* Appearance Section */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>GÖRÜNÜM</Text>
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, ...Shadows.sm }]}>
                    <SettingRow
                        icon="color-palette"
                        iconColor="#e91e63"
                        label="Tema"
                        subtitle={getThemeLabel()}
                        onPress={() => setShowThemeModal(true)}
                    />
                </View>

                {/* About Section */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>HAKKINDA</Text>
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, ...Shadows.sm }]}>
                    <SettingRow
                        icon="information-circle"
                        iconColor="#3498db"
                        label="Versiyon"
                        subtitle="1.0.0"
                    />
                    <SettingRow
                        icon="heart"
                        iconColor="#e74c3c"
                        label="My Notes"
                        subtitle="Alpagu Development tarafından geliştirildi."
                    />
                </View>

                <View style={styles.footer} />
            </ScrollView>

            {/* Theme Picker Modal */}
            <Modal
                visible={showThemeModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowThemeModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowThemeModal(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Tema Seçin</Text>

                        {THEME_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.themeOption,
                                    {
                                        backgroundColor: themePreference === option.value
                                            ? colors.primary + '15'
                                            : 'transparent',
                                        borderColor: themePreference === option.value
                                            ? colors.primary + '40'
                                            : colors.border,
                                    },
                                ]}
                                onPress={() => handleThemeSelect(option.value)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.themeIconContainer, {
                                    backgroundColor: themePreference === option.value
                                        ? colors.primary + '20'
                                        : colors.surfaceElevated,
                                }]}>
                                    <Ionicons
                                        name={option.icon}
                                        size={22}
                                        color={themePreference === option.value ? colors.primary : colors.textSecondary}
                                    />
                                </View>
                                <View style={styles.themeTextContainer}>
                                    <Text style={[
                                        styles.themeLabel,
                                        {
                                            color: themePreference === option.value ? colors.primary : colors.text,
                                        },
                                    ]}>
                                        {option.label}
                                    </Text>
                                    <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                                        {option.description}
                                    </Text>
                                </View>
                                {themePreference === option.value && (
                                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceElevated }]}
                            onPress={() => setShowThemeModal(false)}
                        >
                            <Text style={[styles.modalCloseText, { color: colors.text }]}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxxxl,
    },
    sectionTitle: {
        ...Typography.caption1,
        fontWeight: '600',
        letterSpacing: 0.5,
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.sm,
    },
    section: {
        marginHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: Spacing.md,
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingText: {
        flex: 1,
    },
    settingLabel: {
        ...Typography.body,
    },
    settingSubtitle: {
        ...Typography.caption1,
        marginTop: 2,
    },
    footer: {
        height: 40,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xxl,
    },
    modalContent: {
        width: '100%',
        borderRadius: BorderRadius.xl,
        padding: Spacing.xxl,
    },
    modalTitle: {
        ...Typography.title3,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    themeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        marginBottom: Spacing.sm,
        gap: Spacing.md,
    },
    themeIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeTextContainer: {
        flex: 1,
    },
    themeLabel: {
        ...Typography.headline,
    },
    themeDescription: {
        ...Typography.caption1,
        marginTop: 2,
    },
    modalCloseBtn: {
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    modalCloseText: {
        ...Typography.headline,
    },
});
