import { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
} from 'react-native';
import { useUserContext } from '../contexts/user/UserContext';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function ItemDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const { user } = useUserContext();
    const [currentItem, setCurrentItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItem();
    }, []);

    // to refresh when we come back to this screen after editing
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const loadItem = async () => {
                if (isActive) {
                    await getItem();
                }
            };

            loadItem();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const getItem = () => {
        axios
            .get(`${process.env.EXPO_PUBLIC_CUSTOM_API_URL}/items/${item.id}`)
            .then((res) => {
                // console.log('Item data:', JSON.stringify(res.data, null, 2));
                setCurrentItem(res.data.data); 
                setLoading(false);   
            })
            .catch((err) => {
                console.error('Failed to fetch item', err);
            });
    };

    const deleteHandler = () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this item?', [
            { text: 'Cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    axios
                        .delete(`${process.env.EXPO_PUBLIC_CUSTOM_API_URL}/items/${currentItem.id}`)
                        .then(() => {
                            navigation.goBack();
                        })
                        .catch((err) => {
                            console.error('Delete failed', err);
                            alert('Unable to delete item.');
                        });
                },
            },
        ]);
    };

    console.log('Item details:', currentItem);

    if (loading) {
        return <Text>  Loading...</Text>;
    }

    if (!currentItem) {
        return <Text>No item found.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading && <Text>Loading...</Text>}

            {currentItem.images && currentItem.images.length > 0 && (
                <Image
                    source={{
                        uri: `${process.env.EXPO_PUBLIC_CUSTOM_IMAGES_URL}${currentItem.images[0].url}`,
                    }}
                    style={styles.image}
                />
            )}
            <Text style={styles.title}>{currentItem.title}</Text>
            <Text style={styles.localPrice}>${currentItem.price}</Text>
            <Text style={styles.description}>{currentItem.description}</Text>
            <View style={styles.footer}>
                <Text style={styles.owner}>Posted by: {currentItem.userName}</Text>
                {currentItem.userPhone && (
                    <Text style={styles.phone}>Phone: {currentItem.userPhone}</Text>
                )}
                <Text style={styles.timestamp}>
                    {new Date(currentItem.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </Text>
            </View>

            {currentItem.user.id === user.id && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('ItemForm', { item: currentItem })}
                    >
                        <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={deleteHandler}
                    >
                        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    localPrice: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    footer: {
        marginBottom: 20,
    },
    owner: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    link: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    actionButton: {
        width: 100,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 6,
        alignItems: 'center',
        marginRight: 10,
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    deleteText: {},
});
