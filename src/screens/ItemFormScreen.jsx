import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Switch,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useUserContext } from '../contexts/user/UserContext';

export default function ItemFormScreen({ route, navigation }) {
    const { item } = route.params || {};
    const { user } = useUserContext();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            title: item?.title || '',
            description: item?.description || '',
            price: item ? String(item.price) : '',
        },
    });

    const [imageUri, setImageUri] = useState(item?.imageUri || null);

    useEffect(() => {
        if (item) {
            reset({
                title: item.title,
                description: item.description,
                price: String(item.price),
                });
            // ensure photo is shown when editing existing item
            setImageUri(item.imageUri || null);
        }
    }, [item, reset]);

    const pickImage = async () => {
        console.log('pickImage invoked');
        console.log(ImagePicker);
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('permission status', status);
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to the photo library.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        console.log('image picker result', result);

        // result schema varies by version:
        // { canceled: boolean, assets: [{ uri, ... }] } or { cancelled: boolean, uri }
        if (!result.canceled && result.assets && result.assets.length > 0) {
            console.log('selected asset', result.assets[0]);
            setImageUri(result.assets[0].uri);
        } else if (!result.cancelled && result.uri) {
            console.log('selected image', result.uri);
            // older versions
            setImageUri(result.uri);
        }
    };

    const onSubmit = async (data) => {
        //console.log('onSubmit user: ', user);
        const itemData = {
            title: data.title,
            description: data.description,
            price: parseFloat(data.price) || 0,
            user_id: user.id,
            //userName: user.name,
            //userPhone: user.phone || null,
            //timestamp: item ? item.timestamp : new Date().toISOString(),
            // image_uri: imageUri || null,
        };

        try {
            let response;
            if (item) {
                response = await axios.put(
                    `${process.env.EXPO_PUBLIC_CUSTOM_API_URL}/items/${item.id}`,
                    itemData
                );
                // navigation.navigate('ItemDetail', { item: response.data });
            } else {
                response = await axios.post(
                    `${process.env.EXPO_PUBLIC_CUSTOM_API_URL}/items`,
                    itemData
                );
            }

            navigation.goBack();
        } catch (err) {
            console.error('Failed to save item', err);
            Alert.alert('Save error', 'Unable to save item.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Controller
                control={control}
                name="title"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.title && styles.invalid]}
                        placeholder="Title"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors.title && <Text style={styles.errorText}>Title is required.</Text>}

            <Controller
                control={control}
                name="description"
                rules={{ required: true, minLength: 10 }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, { height: 80 }, errors.description && styles.invalid]}
                        placeholder="Description"
                        value={value}
                        onChangeText={onChange}
                        multiline
                    />
                )}
            />
            {errors.description && <Text style={styles.errorText}>Minimum 10 characters required.</Text>}

            <Controller
                control={control}
                name="price"
                rules={{ required: true, pattern: /^[0-9]+(\.[0-9]{1,2})?$/ }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.price && styles.invalid]}
                        placeholder="Price"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                    />
                )}
            />
            {errors.price && <Text style={styles.errorText}>Valid price required.</Text>}



            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>{imageUri ? 'Change Photo' : 'Pick Photo'}</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

            <TouchableOpacity
                style={[styles.saveButton, isSubmitting && styles.saveDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                <Text style={styles.saveText}>{item ? 'Update' : 'Publish'}</Text>
            </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 15,
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
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
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    imageButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    imageButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    preview: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveDisabled: {
        backgroundColor: '#ccc',
    },
    saveText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
