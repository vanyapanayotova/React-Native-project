import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import ItemCard from '../components/ItemCard';
import { useUserContext } from '../contexts/user/UserContext';
import axios from 'axios';

export default function MainScreen() {
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    const { logout, user } = useUserContext();

    const loadItems = () => {
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/items`)
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error('Failed to load items', error);
            });
    };

    useEffect(() => {
        loadItems();
    }, []);

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setEditingItem(null);
    };

    const saveHandler = () => {
        const itemData = {
            title,
            description,
            price: parseFloat(price) || 0,
            userId: user.id,
            userName: user.name,
            timestamp: new Date().toISOString(),
        };

        const request = editingItem
            ? axios.put(`${process.env.EXPO_PUBLIC_API_URL}/items/${editingItem.id}`, itemData)
            : axios.post(`${process.env.EXPO_PUBLIC_API_URL}/items`, itemData);

        request
            .then(response => {
                if (editingItem) {
                    setItems(prev => prev.map(i => i.id === response.data.id ? response.data : i));
                } else {
                    setItems(prev => [...prev, response.data]);
                }
                clearForm();
            })
            .catch(error => {
                console.error('Failed to save item', error);
                alert('Unable to save item. Please try again.');
            });
    };

    const editHandler = (item) => {
        setEditingItem(item);
        setTitle(item.title);
        setDescription(item.description);
        setPrice(String(item.price));
    };

    const deleteHandler = (item) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to remove this item?', [
            { text: 'Cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/items/${item.id}`)
                    .then(() => {
                        setItems(prev => prev.filter(i => i.id !== item.id));
                    })
                    .catch(error => {
                        console.error('Failed to delete item', error);
                        alert('Unable to delete item.');
                    });
            }},
        ]);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Marketplace</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>{user.name}</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>{editingItem ? 'Edit Item' : 'Publish New Item'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                    <View style={styles.formActions}>
                        {editingItem && (
                            <TouchableOpacity onPress={clearForm} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.saveButton, !(title.trim() && price) ? styles.saveDisabled : null]}
                            disabled={!(title.trim() && price)}
                            onPress={saveHandler}
                        >
                            <Text style={styles.saveText}>{editingItem ? 'Update' : 'Publish'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.itemsList}>
                    {items.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No items yet.</Text>
                        </View>
                    ) : (
                        items.map(item => (
                            <ItemCard
                                key={item.id}
                                {...item}
                                isMyItem={item.userId === user.id}
                                onEdit={() => editHandler(item)}
                                onDelete={() => deleteHandler(item)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingTop: 50,
        backgroundColor: '#007AFF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    logoutButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
    },
    content: {
        padding: 10,
    },
    formContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    cancelText: {
        color: '#FF3B30',
    },
    saveButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 10,
    },
    saveDisabled: {
        backgroundColor: '#ccc',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemsList: {
        flex: 1,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});
