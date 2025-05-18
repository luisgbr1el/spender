import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Card({ title, text, textColor, backgroundColor, onPress }) {
    return (
        <View style={[styles.card, { backgroundColor: backgroundColor || '#fff' }]}>
            <Text style={[styles.cardTitle, { color: textColor || '#000000' }]}>{title}</Text>
            <Text style={[styles.cardText, { color: textColor || '#000000' }]}>{text}</Text>
            {/* <Button title="Press me" onPress={onPress} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    balance: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: {
        borderRadius: 8,
        padding: 16,
        marginVertical: 10,
        marginHorizontal: 0
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 8
    },
    cardText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 8
    }
});