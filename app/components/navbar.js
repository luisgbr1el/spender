import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../_layout';

export default function Navbar({ navigation }) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    
                    bottom: insets.bottom,
                }
            ]}
        >

            <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.push('/add')}
            >
                <Ionicons name="add" size={24} color={theme.text} />
                <Text style={{ color: theme.text }}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.push('/settings')}
            >
                <Ionicons name="cog" size={24} color={theme.text} />
                <Text style={{ color: theme.text }}>Ajustes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: 'rgba(105, 105, 105, 0.2)',
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1000
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    }
});