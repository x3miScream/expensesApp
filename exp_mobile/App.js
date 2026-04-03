import React, { useState, useEffect } from 'react';
import { dummy_transactions } from './dummy_data/data';
import {formatCurrency, getRangeOfActiveMonths} from './Utils/Utils.jsx';
import useAuth from './Hooks/useAuth.jsx';
import OverallBalanceSection from './Components/OverallBalanceSection/OverallBalanceSection.jsx';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Platform,
} from 'react-native';

import {Styles, THEME} from './Styles/Styles.jsx';

// For the purposes of this preview environment, we use lucide-react.
// In your local Expo project, simply change this to:
// import { ... } from 'lucide-react-native';
import { 
  Wallet, 
  Receipt, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X,
  CreditCard,
  PieChart
} from 'lucide-react-native';

import MonthlyBudgetGrid from './Components/MonthlyBudgetGrid/MonthlyBudgetGrid.jsx';

const {login, getCurrentUserAsync} = useAuth();

// --- MODULAR COMPONENTS ---

const Header = ({ onAddPress }) => (
  <View style={Styles.headerContainer}>
    <View>
      <Text style={Styles.headerSubtitle}>Good morning Mr. Atai</Text>
      <Text style={Styles.headerTitle}>My Finances</Text>
    </View>
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={Styles.addButton}
      onPress={onAddPress}
    >
      <Plus size={24} color="#fff" strokeWidth={3} />
    </TouchableOpacity>
  </View>
);

const TransactionItem = ({ item, onDelete }) => (
  <View style={Styles.transactionCard}>
    <View style={Styles.transactionIconContainer}>
      <Receipt size={20} color={THEME.colors.textSecondary} />
    </View>
    <View style={Styles.transactionDetails}>
      <Text style={Styles.transactionTitle}>{item.name}</Text>
      <Text style={Styles.transactionMeta}>{item.category} • {item.date}</Text>
    </View>
    <View style={{ alignItems: 'flex-end' }}>
      <Text style={[
        Styles.transactionAmount, 
        { color: item.amount < 0 ? THEME.colors.textPrimary : THEME.colors.success }
      ]}>
        {item.amount < 0 ? `-RM${Math.abs(item.amount).toFixed(2)}` : `+RM${item.amount.toFixed(2)}`}
      </Text>
    </View>
  </View>
);

// --- MAIN APPLICATION COMPONENT ---

export default function App() {

  useEffect(() => {
    login({
      userEmail: "ataybekenov@gmail.com",
      password: "!Q2w3e4r"
    });
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ title: '', amount: '', category: 'General', type: 'expense' });
  const [transactions, setTransactions] = useState(dummy_transactions);

  const handleAddTransaction = () => {
    if (!newTransaction.title || !newTransaction.amount) return;
    
    const amountNum = parseFloat(newTransaction.amount);
    const item = {
      id: Date.now().toString(),
      title: newTransaction.title,
      amount: newTransaction.type === 'expense' ? -amountNum : amountNum,
      category: newTransaction.category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'dd' }),
    };

    setTransactions([item, ...transactions]);
    setModalVisible(false);
    setNewTransaction({ title: '', amount: '', category: 'General', type: 'expense' });
  };

  // Calculate dynamic totals
  const totals = transactions.reduce((acc, curr) => {
    if (curr.amount > 0) acc.income += curr.amount;
    else acc.expense += Math.abs(curr.amount);
    acc.balance = acc.income - acc.expense;
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  return (
    <SafeAreaView style={Styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        contentContainerStyle={Styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header onAddPress={() => setModalVisible(true)} />
        
        <OverallBalanceSection 
          total={totals.balance} 
          income={totals.income} 
          expense={totals.expense} 
        />

        <MonthlyBudgetGrid months={getRangeOfActiveMonths()}></MonthlyBudgetGrid>

        {/* Quick Actions Row */}
        <View style={Styles.quickActionsContainer}>
          <TouchableOpacity style={Styles.quickAction}>
            <View style={[Styles.qaIcon, { backgroundColor: '#eff6ff' }]}>
              <CreditCard size={20} color={THEME.colors.primary} />
            </View>
            <Text style={Styles.qaText}>Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.quickAction}>
            <View style={[Styles.qaIcon, { backgroundColor: '#f5f3ff' }]}>
              <PieChart size={20} color={THEME.colors.secondary} />
            </View>
            <Text style={Styles.qaText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.quickAction}>
            <View style={[Styles.qaIcon, { backgroundColor: '#ecfdf5' }]}>
              <TrendingUp size={20} color={THEME.colors.success} />
            </View>
            <Text style={Styles.qaText}>Saving</Text>
          </TouchableOpacity>
        </View>

        <View style={Styles.sectionHeader}>
          <Text style={Styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={Styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.map((item) => (
          <TransactionItem key={item.id} item={item} />
        ))}

        {/* Padding for bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={Styles.modalOverlay}>
          <View style={Styles.modalContent}>
            <View style={Styles.modalHeader}>
              <Text style={Styles.modalTitle}>New Transaction</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={THEME.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={Styles.typeSelector}>
              <TouchableOpacity 
                style={[Styles.typeBtn, newTransaction.type === 'expense' && Styles.typeBtnActive]}
                onPress={() => setNewTransaction({...newTransaction, type: 'expense'})}
              >
                <Text style={[Styles.typeBtnText, newTransaction.type === 'expense' && Styles.typeBtnTextActive]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[Styles.typeBtn, newTransaction.type === 'income' && Styles.typeBtnActive]}
                onPress={() => setNewTransaction({...newTransaction, type: 'income'})}
              >
                <Text style={[Styles.typeBtnText, newTransaction.type === 'income' && Styles.typeBtnTextActive]}>Income</Text>
              </TouchableOpacity>
            </View>
            
            <View style={Styles.inputGroup}>
              <Text style={Styles.inputLabel}>Transaction Name</Text>
              <TextInput 
                style={Styles.input} 
                placeholder="e.g. Weekly Groceries"
                placeholderTextColor="#94a3b8"
                value={newTransaction.title}
                onChangeText={(text) => setNewTransaction({...newTransaction, title: text})}
              />
            </View>

            <View style={Styles.inputGroup}>
              <Text style={Styles.inputLabel}>Amount ($)</Text>
              <TextInput 
                style={Styles.input} 
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#94a3b8"
                value={newTransaction.amount}
                onChangeText={(text) => setNewTransaction({...newTransaction, amount: text})}
              />
            </View>

            <TouchableOpacity style={Styles.saveButton} onPress={handleAddTransaction}>
              <Text style={Styles.saveButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}