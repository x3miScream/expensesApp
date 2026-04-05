import { useState, useEffect } from 'react';
import {getRangeOfActiveMonths} from './Utils/Utils.jsx';
import useAuth from './Hooks/useAuth.jsx';
import OverallBalanceSection from './Components/OverallBalanceSection/OverallBalanceSection.jsx';
import AddUpdateTransaction from './Components/AddUpdateTransaction/AddUpdateTransaction.jsx';
import useTransactionCreateUdpateDelete from './Hooks/useTransactionCreateUdpateDelete.jsx';
import {APP_EVENT_CONSTANTS} from './Constants/ApplicationEventConstants.jsx';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  DeviceEventEmitter,
  Modal
} from 'react-native';

import {Styles, THEME} from './Styles/Styles.jsx';

// For the purposes of this preview environment, we use lucide-react.
// In your local Expo project, simply change this to:
// import { ... } from 'lucide-react-native';
import { 
  RefreshCcw,
  Receipt,
  TrendingUp,
  Plus,
  CreditCard,
  PieChart,
  Tag,
  ChevronDown
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
      activeOpacity={0.1} 
      style={Styles.addButton}
      onPress={onAddPress}
    >
      <Plus size={24} color="#fff" strokeWidth={3} />
    </TouchableOpacity>
  </View>
);

const TransactionItem = ({ item, onEditTransactionCallback }) => {
  return (<TouchableOpacity onPress={() => onEditTransactionCallback(item)}>
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
  </TouchableOpacity>
)
};

// --- MAIN APPLICATION COMPONENT ---

export default function App() {

  const {saveLoadingState, getPagedTransactions} = useTransactionCreateUdpateDelete();

  useEffect(() => {
    login({
      userEmail: "ataybekenov@gmail.com",
      password: "!Q2w3e4r"
    });

    // getPagedTransactions(displayPeriod, transactionPagingData.itemsPerPage, transactionPagingData.pageNumber, setTransactions);

    const transactionUdpateEventSubscription = DeviceEventEmitter.addListener(APP_EVENT_CONSTANTS.TRANSACTION_ADD_EVENT, (data) => {
      getPagedTransactions(displayPeriod, transactionPagingData.itemsPerPage, transactionPagingData.pageNumber, setTransactions);
    });

    // 2. IMPORTANT: Clean up the listener on unmount to prevent memory leaks
    return () => {
      transactionUdpateEventSubscription.remove();
    };
  }, []);

  ////Fix change of period to refresh transaction grid
  useEffect(() => {
    console.log(`updating period to: ${displayPeriod}`)
    getPagedTransactions(displayPeriod, transactionPagingData.itemsPerPage, transactionPagingData.pageNumber, setTransactions);
  }, [displayPeriod]);

  const [displayPeriod, setDisplayPeriod] = useState(getRangeOfActiveMonths()[0]);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [displayPeriodList, setDisplayPeriodList] = useState(getRangeOfActiveMonths());
  const [editTransactionDetails, setEditTransactionDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ title: '', amount: '', category: 'General', type: 'expense', transactionDate: new Date() });
  const [transactions, setTransactions] = useState({
    totalRecords: 0,
    data: []
  });
  const [transactionPagingData, setTransactionPagingData] = useState({
    itemsPerPage: 10,
    pageNumber: 0
  });

  const editTransaction = (transaction) => {
    setEditTransactionDetails(transaction);
    setModalVisible(true);
  };

  const addTransaction = () => {
    setEditTransactionDetails(null);
    setModalVisible(true);
  };

  // Calculate dynamic totals
  const totals = transactions.data.reduce((acc, curr) => {
    if (curr.amount > 0) acc.income += curr.amount;
    else acc.expense += Math.abs(curr.amount);
    acc.balance = acc.income - acc.expense;
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  const refreshTransactionGridDataAsync = async () => {
    await getPagedTransactions(displayPeriod, transactionPagingData.itemsPerPage, transactionPagingData.pageNumber, setTransactions);
  };

  const selectDisplayPeriod = (displayPeriod) => {
    setDisplayPeriod(displayPeriod);
    setShowPeriodDropdown(false);
  };

  return (
    <SafeAreaView style={Styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        contentContainerStyle={Styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header onAddPress={() => addTransaction()} />
        
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

        <Text style={Styles.label}>Period - {displayPeriod}</Text>
        <View style={Styles.sectionHeader}>
          <TouchableOpacity 
          style={Styles.inputWrapper} 
          onPress={() => {
              setShowPeriodDropdown(!showPeriodDropdown);
          }}
          >
          <Text style={[Styles.valueText, !displayPeriod && Styles.placeholderText]}>
              {displayPeriod || "Select Period"}
          </Text>
          <ChevronDown size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        {showPeriodDropdown && (
          <View style={Styles.dropdown}>
              {displayPeriodList.map((disPeriod) => (
              <TouchableOpacity key={disPeriod} style={Styles.dropdownItem} onPress={() => selectDisplayPeriod(disPeriod)}>
                  <Text style={Styles.dropdownItemText}>{disPeriod}</Text>
              </TouchableOpacity>
              ))}
          </View>
          )}

        <View style={Styles.sectionHeader}>
          <Text style={Styles.sectionTitle}>Recent Activity</Text>
          <Text style={Styles.sectionTitle}>Page: {transactionPagingData.pageNumber + 1} out of: {Math.ceil(transactions.totalRecords / transactionPagingData.itemsPerPage)}</Text>
          <TouchableOpacity onPress={async () => await refreshTransactionGridDataAsync()}>
            <RefreshCcw style={Styles.refreshButtonDark} />
          </TouchableOpacity>
        </View>

        {transactions.data.map((item) => (
          <TransactionItem onEditTransactionCallback={editTransaction} key={item.id} item={item} />
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
        <AddUpdateTransaction setIsModalVisibleCallback={setModalVisible} editTransaction={editTransactionDetails}></AddUpdateTransaction>
      </Modal>
    </SafeAreaView>
  );
}