import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { useUserContext } from '../contexts/user/UserContext';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

export default function LoginScreen({
    navigation
}) {
    const { login }  = useUserContext();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { email: '', password: '' },
    });

    const loginHandler = (data) => {
        const { email, password } = data;
        axios.post(`${process.env.EXPO_PUBLIC_CUSTOM_API_URL}/users/login`, {
            email,
            password,
        })
            .then(response => {
                console.log('Login successful', response.data);
                const { accessToken, user } = response.data;
                login(user, accessToken);
            })
            .catch(error => {
                console.error('Login failed', error);
                alert('Login failed. Please check your credentials and try again.');
            });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Marketplace</Text>
                <Text style={styles.subtitle}>Login to continue</Text>

                <Controller
                control={control}
                name="email"
                rules={{ required: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.email && styles.invalid]}
                        placeholder="Email"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                )}
            />
            {errors.email && <Text style={styles.errorText}>Valid email required</Text>}

            <Controller
                control={control}
                name="password"
                rules={{ required: true, minLength: 6 }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.password && styles.invalid]}
                        placeholder="Password"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={true}
                    />
                )}
            />
            {errors.password && <Text style={styles.errorText}>Password (min 6 chars)</Text>}

            <TouchableOpacity
                style={[styles.button, isSubmitting && styles.saveDisabled]}
                onPress={handleSubmit(loginHandler)}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 16,
    },
    invalid: {
        borderColor: '#FF3B30',
        borderWidth: 1,
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 8,
    },
    saveDisabled: {
        backgroundColor: '#ccc',
    },
});
