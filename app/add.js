import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import uuid from 'react-native-uuid';
import { useTheme } from './_layout';

const categories = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Outros'];

export default function AddTransactionScreen() {
  const { theme } = useTheme();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Outros');
  const [isNegative, setIsNegative] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  useEffect(() => {
    if (!isEditing) return;

    const loadTransaction = async () => {
      try {
        const data = await AsyncStorage.getItem('@transactions');
        const transactions = JSON.parse(data || '[]');
        const transaction = transactions.find(t => t.id === id);
        
        if (transaction) {
          setDescription(transaction.description);
          setCategory(transaction.category || 'Outros');
          const amountValue = transaction.amount;
          // Check if negative and set state accordingly
          setIsNegative(amountValue < 0);
          // Store absolute value in the input
          setAmount(String(Math.abs(amountValue)).replace('.', ','));
        }
      } catch (error) {
        console.error('Error loading transaction:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados da transação.');
      }
    };

    loadTransaction();
  }, [id, isEditing]);

  const toggleSign = () => {
    setIsNegative(!isNegative);
  };

  const saveTransaction = async () => {
    let value = parseFloat(amount.replace(',', '.'));
    if (!description || isNaN(value)) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
      return;
    }
    
    // Apply sign based on isNegative state
    if (isNegative) {
      value = -Math.abs(value);
    } else {
      value = Math.abs(value);
    }

    try {
      const existing = await AsyncStorage.getItem('@transactions');
      const transactions = existing ? JSON.parse(existing) : [];
      
      if (isEditing) {
        const updatedTransactions = transactions.map(t => 
          t.id === id 
          ? { ...t, description, amount: value, category, updatedAt: new Date().toISOString() } 
          : t
        );
        await AsyncStorage.setItem('@transactions', JSON.stringify(updatedTransactions));
      } else {
        const newTransaction = {
          id: uuid.v4(),
          description,
          amount: value,
          category,
          date: new Date().toISOString(),
        };
        const updated = [newTransaction, ...transactions];
        await AsyncStorage.setItem('@transactions', JSON.stringify(updated));
      }
      
      router.back();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[{ color: theme.text }]}>Descrição:</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.placeholder }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Ex: Supermercado"
        placeholderTextColor={theme.placeholder}
      />

      <Text style={[{ color: theme.text }]}>Valor:</Text>
      <View style={styles.amountInputContainer}>
        <TouchableOpacity 
          style={[styles.signButton, { backgroundColor: isNegative ? '#ff6b6b' : '#5abf70' }]} 
          onPress={toggleSign}
        >
          <Text style={styles.signButtonText}>{isNegative ? '-' : '+'}</Text>
        </TouchableOpacity>
        
        <TextInput
          style={[
            styles.amountInput, 
            { color: theme.text, borderColor: theme.placeholder }
          ]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="50,00"
          placeholderTextColor={theme.placeholder}
        />
      </View>
      <Text style={[styles.helperText, { color: theme.placeholder }]}>
        {isNegative ? 'Despesa (valor será negativo)' : 'Receita (valor será positivo)'}
      </Text>

      <Text style={[{ color: theme.text }]}>Categoria:</Text>
      <TouchableOpacity
        style={[styles.categoryButton, { borderColor: theme.placeholder }]}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Text style={{ color: theme.text }}>{category}</Text>
        <Text style={{ color: theme.placeholder }}>Selecionar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#5abf70' }]} 
        onPress={saveTransaction}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          {isEditing ? 'Atualizar' : 'Salvar'}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={categoryModalVisible}
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCategoryModalVisible(false)}>
          <View style={[styles.categoryModal, { backgroundColor: theme.backgroundContainer }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Escolha uma categoria</Text>
            <ScrollView>
              {categories.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.categoryOption}
                  onPress={() => {
                    setCategory(option);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text style={{ color: theme.text }}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    gap: 10 
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  signButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  signButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    padding: 0,
    margin: 0,
    verticalAlign: 'middle'
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
  },
  helperText: {
    fontSize: 12,
    marginTop: -5,
    marginBottom: 15,
  },
  categoryButton: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  categoryModal: {
    borderRadius: 8,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryOption: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.35)',
  },
  button: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});