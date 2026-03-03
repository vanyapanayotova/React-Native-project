import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

export default function ItemCard({
    title,
    description,
    price,
    userName,
    created_at,
    imageUri,
    isMyItem,
    onEdit,
    onPress,
}) {
    const Container = onPress ? TouchableOpacity : View;
    const containerProps = onPress ? { onPress } : {};

    console.log(created_at);

    return (
        <Container
            style={[
                styles.cardContainer,
                isMyItem ? styles.myCard : styles.otherCard,
            ]}
            {...containerProps}
        >
            {imageUri && <Image source={{ uri: imageUri }} style={styles.cardImage} />}
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {isMyItem && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={onEdit}
                            style={[styles.actionButton, { marginRight: 0 }]}
                        >
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.price}>${price}</Text>
            <View style={styles.footer}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.timestamp}>{new Date(created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
            </View>
        </Container>
    );
}


const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        padding: 12,
        borderRadius: 10,
        marginVertical: 6,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    myCard: {
        borderColor: '#007AFF',
    },
    otherCard: {
        borderColor: '#e0e0e0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        // push actions to the right edge
        marginLeft: 'auto',
    },
    actionButton: {
        padding: 4,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 14,
        color: '#007AFF',
        textAlign: 'center',
    },
    deleteButton: {},
    deleteText: {
        color: '#FF3B30',
    },
    description: {
        fontSize: 16,
        marginVertical: 8,
        color: '#333',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userName: {
        fontSize: 12,
        color: '#666',
    },
    timestamp: {
        fontSize: 10,
        color: '#999',
    },
});
