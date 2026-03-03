import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    StatusBar,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const performSearch = () => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        setError(null);
        axios
            .get(`${process.env.EXPO_PUBLIC_CUSTOM_API_URL}/items`, {
                params: { q: query },
            })
            .then((res) => {
                setResults(res.data.data);
            })
            .catch((err) => {
                console.error('Search failed', err);
                setError('Unable to perform search');
            })
            .finally(() => setLoading(false));
    };

    const isFocused = useIsFocused();

    // clear query and results each time the screen comes into focus
    useEffect(() => {
        if (isFocused) {
            setQuery('');
            setResults([]);
            setError(null);
        }
    }, [isFocused]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() =>
                navigation.navigate('Marketplace', {
                    screen: 'ItemDetail',
                    params: { item },
                })
            }
        >
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultPrice}>${item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search items..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={performSearch}
                returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={performSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#007AFF" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={results}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                style={styles.resultsList}
            />
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    searchButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 10,
    },
    resultsList: {
        flex: 1,
    },
    resultItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    resultPrice: {
        marginTop: 4,
        color: '#666',
    },
});
