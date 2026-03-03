import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import ItemCard from '../components/ItemCard';
import { useUserContext } from '../contexts/user/UserContext';
import axios from 'axios';

export default function ItemsListScreen({ navigation }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const { user } = useUserContext();

    const loadItems = useCallback(() => {
        setLoading(true);
        setError(null);
        axios
            .get(`${process.env.EXPO_PUBLIC_API_URL}/items`)
            .then((response) => {
                setItems(response.data);
            })
            .catch((err) => {
                console.error('Failed to load items', err);
                setError('Unable to load items');
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    // refresh when returning to screen
    useFocusEffect(
        useCallback(() => {
            loadItems();
        }, [loadItems])
    );

    // add button to header to navigate to form
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('ItemForm')}
                    style={{ marginRight: 15 }}
                >
                    <Text style={{ color: '#007AFF', fontSize: 18 }}>+ New</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        loadItems();
    };


    return (
        <View style={styles.container}>
            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Text style={styles.linkText} onPress={loadItems}>
                        Tap to retry
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <ItemCard
                            {...item}
                            isMyItem={item.userId === user.id}
                            onEdit={() => navigation.navigate('ItemForm', { item })}
                            onDelete={() => {
                                axios
                                    .delete(`${process.env.EXPO_PUBLIC_API_URL}/items/${item.id}`)
                                    .then(() => {
                                        setItems((prev) => prev.filter((i) => i.id !== item.id));
                                    })
                                    .catch((err) => {
                                        console.error('Failed to delete item', err);
                                        alert('Unable to delete item.');
                                    });
                            }}
                            onPress={() => navigation.navigate('ItemDetail', { item })}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={() => (
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No items yet.</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 8,
    },
    linkText: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
});
