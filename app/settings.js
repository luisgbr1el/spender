import {
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import { useTheme } from './_layout';

export default function SettingsScreen() {
    const { theme, toggleTheme, themeName } = useTheme();
    const isDark = themeName === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.settingItem, { backgroundColor: theme.backgroundContainer }]}>
                <Text style={[styles.settingText, { color: theme.text }]}>
                    Modo escuro
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#5abf70" }}
                    thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={isDark}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
    }
});