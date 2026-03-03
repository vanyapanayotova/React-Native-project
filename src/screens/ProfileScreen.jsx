import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUserContext } from '../contexts/user/UserContext';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';

export default function ProfileScreen({ route }) {
    const { user, logout, login } = useUserContext();
    const { userId } = (route?.params ?? {});
    const [profile, setProfile] = useState(user);

    useEffect(() => {
        if (userId && userId !== user.id) {
            axios
                .get(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`)
                .then((res) => setProfile(res.data))
                .catch((err) => console.error('Failed to load profile', err));
        }
    }, [userId]);

    const handleBiometricLogin = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) {
            alert('Biometric authentication not available on this device');
            return;
        }
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
            alert('No biometrics enrolled');
            return;
        }
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate',
        });
        if (result.success) {
            alert('Biometric check passed');
        } else {
            alert('Authentication failed');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.name}>{profile?.name}</Text>
            <Text style={styles.email}>{profile?.email}</Text>

            <TouchableOpacity style={styles.button} onPress={handleBiometricLogin}>
                <Text style={styles.buttonText}>Test Biometric</Text>
            </TouchableOpacity>


            <TouchableOpacity style={[styles.button, styles.logoutBtn]} onPress={logout}>
                <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    button: {
        padding: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
        width: '80%',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutBtn: {
        backgroundColor: '#FF3B30',
    },
    logoutText: {
        color: '#fff',
    },
});