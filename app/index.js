import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  findNodeHandle,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './_layout';
import Card from './components/card';
import Navbar from './components/navbar';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const buttonRefs = useRef({});

  const loadTransactions = async () => {
    try {
      const data = await AsyncStorage.getItem('@transactions');
      const parsed = data ? JSON.parse(data) : [];
      setTransactions(parsed);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as transações.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const getBalance = () => {
    const balance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    return formatCurrency(balance);
  };

  const handleDelete = async (id) => {
    try {
      const newTransactions = transactions.filter(tx => tx.id !== id);
      setTransactions(newTransactions);
      await AsyncStorage.setItem('@transactions', JSON.stringify(newTransactions));
      console.log('Transação deletada, novo array salvo');
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      Alert.alert('Erro', 'Não foi possível deletar a transação.');
    }
  };

  const openMenu = (itemId) => {
    const node = findNodeHandle(buttonRefs.current[itemId]);
    if (!node) return;

    UIManager.measureInWindow(node, (x, y, width, height) => {
      setMenuPosition({ x, y: y + height });
      setSelectedItem(transactions.find(t => t.id === itemId));
      setMenuVisible(true);
    });
  };

  return (
    <View style={styles.container}>
      <Card
        title="Saldo"
        text={getBalance()}
        textColor={theme.text}
        backgroundColor="#5abf70"
      />
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: theme.backgroundContainer }]}>
            <View style={styles.descriptionContainer}>
              <Text 
                style={[styles.description, { color: theme.text }]} 
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </View>
            
            <View style={styles.amountContainer}>
              <Text style={[styles.amount, { color: item.amount < 0 ? 'red' : '#5abf70' }]}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
            
            <TouchableOpacity
              ref={(ref) => (buttonRefs.current[item.id] = ref)}
              onPress={() => openMenu(item.id)}
              style={styles.dotsButton}
            >
              <Text style={[styles.dots, { color: theme.text }]}>⋮</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menu, {
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x - 120,
            backgroundColor: theme.backgroundContainer,
          }]}>
            <TouchableOpacity onPress={() => {
              setMenuVisible(false);
              router.push({
                pathname: '/add',
                params: { id: selectedItem?.id }
              });
            }}>
              <Text style={[styles.option, { color: theme.text }]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              Alert.alert(
                "Confirmar exclusão",
                `Tem certeza que deseja excluir "${selectedItem?.description}"?`,
                [
                  {
                    text: "Cancelar",
                    style: "cancel"
                  },
                  {
                    text: "Confirmar",
                    onPress: () => handleDelete(selectedItem?.id),
                    style: "destructive"
                  }
                ]
              );
              setMenuVisible(false);
            }}>
              <Text style={[styles.option, { color: theme.text }]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Navbar navigation={router} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0, // Remove bottom padding from container
  },
  item: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
  },
  amountContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'flex-end', // Right-align the amount text
    marginRight: 5,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
  },
  dotsButton: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 0,
    marginLeft: 20
  },
  dots: { 
    fontSize: 22,
    lineHeight: 24,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.23)',
  },
  menu: {
    borderRadius: 6,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    minWidth: 140,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
  },
});

export const options = {
  title: 'Início',
};