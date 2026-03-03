import axios from 'axios';
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { useUserContext } from '../contexts/user/UserContext';
import { useForm, Controller } from 'react-hook-form';

export default function RegisterScreen({
    navigation,
}) {
    const { login } = useUserContext();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm({
        defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
    });

    const passwordValue = watch('password');

    const registerHandler = (data) => {
        console.log('register data', data);
        const { name, email, password, confirmPassword, phone } = data;
        if (password !== confirmPassword) {
            return Alert.alert('Password mismatch');
        }
        const payload = {
            name,
            email,
            password,
        };
        if (phone) {
            payload.phone = phone;
        }
        axios.post(`${process.env.EXPO_PUBLIC_API_URL}/register`, payload)
            .then(response => {
                Alert.alert('Registration Successful', 'You are now registered and logged in.', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);

                login(response.data.user, response.data.accessToken);
            })
            .catch(error => {
                console.error('Registration failed', error);
                Alert.alert('Registration Failed', 'An error occurred during registration. Please try again.');
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Marketplace</Text>

            <Controller
                control={control}
                name="name"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.name && styles.invalid]}
                        placeholder="Name"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="words"
                    />
                )}
            />
            {errors.name && <Text style={styles.errorText}>Name is required</Text>}

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
                name="phone"
                rules={{ pattern: /^[0-9+\- ]{7,15}$/ }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.phone && styles.invalid]}
                        placeholder="Phone (optional)"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                    />
                )}
            />
            {errors.phone && <Text style={styles.errorText}>Phone format invalid</Text>}
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

            <Controller
                control={control}
                name="confirmPassword"
                rules={{
                    required: true,
                    validate: (v) => v === passwordValue || 'Passwords do not match',
                }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.confirmPassword && styles.invalid]}
                        placeholder="Confirm Password"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={true}
                    />
                )}
            />
            {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message || 'Confirmation required'}</Text>
            )}

            <TouchableOpacity
                style={[styles.button, isSubmitting && styles.saveDisabled]}
                onPress={handleSubmit(registerHandler)}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
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
        backgroundColor: '#34C759',
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
