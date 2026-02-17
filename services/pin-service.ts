import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'mynotes_pin';

export async function setPin(pin: string): Promise<void> {
    await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function verifyPin(pin: string): Promise<boolean> {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    return storedPin === pin;
}

export async function hasPin(): Promise<boolean> {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    return storedPin !== null && storedPin !== '';
}

export async function removePin(): Promise<void> {
    await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function authenticateWithBiometrics(): Promise<boolean> {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) return false;

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) return false;

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Notlarınıza erişmek için doğrulayın',
            cancelLabel: 'PIN ile giriş',
            disableDeviceFallback: true,
        });

        return result.success;
    } catch {
        return false;
    }
}

export async function isBiometricsAvailable(): Promise<boolean> {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        return hasHardware && isEnrolled;
    } catch {
        return false;
    }
}
