import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default function ItemCard({
    title,
    description,
    price,
    userName,
    timestamp,
    isMyItem,
    onEdit,
    onDelete,
}) {
    return (
        <View
            style={[
                styles.cardContainer,
                isMyItem ? styles.myCard : styles.otherCard,
            ]}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {isMyItem && (
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
                            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.price}>${price}</Text>
            <View style={styles.footer}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
            </View>
        </View>
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
    myCard: {
        borderColor: '#007AFF',
    },
    otherCard: {
        borderColor: '#e0e0e0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 4,
    },
    actionText: {
        fontSize: 14,
        color: '#007AFF',
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
