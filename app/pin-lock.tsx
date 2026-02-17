import PinInput from '@/components/PinInput';
import { useThemeColors } from '@/hooks/useThemeColors';
import * as PinService from '@/services/pin-service';
import { getNoteById, saveNote, saveSettings } from '@/services/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

type PinMode = 'verify' | 'set' | 'change' | 'verify-disable' | 'verify-unprotect';

export default function PinLockScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { noteId, mode } = useLocalSearchParams<{
        noteId?: string;
        mode: PinMode;
    }>();

    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [step, setStep] = useState<'current' | 'new' | 'confirm'>(() => {
        if (mode === 'set') return 'new';
        if (mode === 'change') return 'current';
        return 'current'; // verify, verify-disable, verify-unprotect
    });
    const [newPin, setNewPin] = useState('');
    const [showBiometric, setShowBiometric] = useState(false);

    // Check biometrics availability
    React.useEffect(() => {
        PinService.isBiometricsAvailable().then(setShowBiometric);
    }, []);

    const handleDigit = useCallback(
        (digit: string) => {
            if (pin.length >= 4) return;
            const newPinValue = pin + digit;
            setPin(newPinValue);
            setError(false);

            if (newPinValue.length === 4) {
                setTimeout(() => processPin(newPinValue), 200);
            }
        },
        [pin, step, newPin, mode, noteId]
    );

    const processPin = async (fullPin: string) => {
        if (step === 'current') {
            // Verify current PIN
            const valid = await PinService.verifyPin(fullPin);
            if (valid) {
                if (mode === 'verify' && noteId) {
                    // Not görüntüleme
                    router.replace({ pathname: '/note/[id]', params: { id: noteId } });
                } else if (mode === 'change') {
                    // PIN değiştirme — yeni PIN adımına geç
                    setStep('new');
                    setPin('');
                } else if (mode === 'verify-disable') {
                    // PIN korumasını tamamen kaldır
                    await PinService.removePin();
                    await saveSettings({ hasPin: false });
                    Alert.alert('Başarılı', 'PIN koruması kaldırıldı.');
                    router.back();
                } else if (mode === 'verify-unprotect' && noteId) {
                    // Not'un PIN korumasını kaldır
                    const note = await getNoteById(noteId);
                    if (note) {
                        await saveNote({ ...note, isPinProtected: false });
                    }
                    Alert.alert('Başarılı', 'Not koruması kaldırıldı.');
                    router.back();
                }
            } else {
                setError(true);
                setPin('');
            }
        } else if (step === 'new') {
            setNewPin(fullPin);
            setStep('confirm');
            setPin('');
        } else if (step === 'confirm') {
            if (fullPin === newPin) {
                await PinService.setPin(fullPin);
                await saveSettings({ hasPin: true });
                router.back();
            } else {
                setError(true);
                setPin('');
                setStep('new');
                setNewPin('');
            }
        }
    };

    const handleDelete = useCallback(() => {
        setPin((prev) => prev.slice(0, -1));
        setError(false);
    }, []);

    const handleBiometric = useCallback(async () => {
        const success = await PinService.authenticateWithBiometrics();
        if (success) {
            if (mode === 'verify' && noteId) {
                router.replace({ pathname: '/note/[id]', params: { id: noteId } });
            } else if (mode === 'verify-disable') {
                await PinService.removePin();
                await saveSettings({ hasPin: false });
                Alert.alert('Başarılı', 'PIN koruması kaldırıldı.');
                router.back();
            } else if (mode === 'verify-unprotect' && noteId) {
                const note = await getNoteById(noteId);
                if (note) {
                    await saveNote({ ...note, isPinProtected: false });
                }
                Alert.alert('Başarılı', 'Not koruması kaldırıldı.');
                router.back();
            }
        }
    }, [mode, noteId]);

    const getTitle = () => {
        if (step === 'current') return 'PIN Giriniz';
        if (step === 'new') return 'Yeni PIN Belirleyin';
        return 'PIN\'i Onaylayın';
    };

    const getSubtitle = () => {
        if (step === 'current' && mode === 'verify') return 'Bu not PIN korumalıdır';
        if (step === 'current' && mode === 'verify-disable') return 'PIN korumasını kaldırmak için doğrulayın';
        if (step === 'current' && mode === 'verify-unprotect') return 'Not korumasını kaldırmak için doğrulayın';
        if (step === 'current' && mode === 'change') return 'Mevcut PIN\'inizi girin';
        if (step === 'new') return '4 haneli bir PIN girin';
        return 'Aynı PIN\'i tekrar girin';
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PinInput
                pin={pin}
                onPress={handleDigit}
                onDelete={handleDelete}
                onBiometric={handleBiometric}
                error={error}
                title={getTitle()}
                subtitle={getSubtitle()}
                showBiometric={showBiometric && step === 'current' && (mode === 'verify' || mode === 'verify-disable' || mode === 'verify-unprotect')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
