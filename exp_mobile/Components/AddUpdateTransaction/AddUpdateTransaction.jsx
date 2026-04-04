import React, { useState, useEffect } from 'react';
import useTransactionCreateUdpateDelete from '../../Hooks/useTransactionCreateUdpateDelete.jsx';
import useCategoryCRUD from '../../Hooks/useCategoryCRUD.jsx';
import useGetRecurringTransactions from '../../Hooks/useGetRecurringTransactions.jsx';
import {formatCurrency, getRangeOfActiveMonths, formatDate} from '../../Utils/Utils.jsx';

import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  Modal, 
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
  Calendar, 
  ChevronDown, 
  Check, 
  X, 
  Tag, 
  Layers, 
  DollarSign, 
  FileText
} from 'lucide-react-native';

/**
 * Mobile Expense Tracker - Add Transaction Modal
 * * This code is optimized for a React Native environment (Expo 54.0.33).
 * Note: Native modules like 'react-native' and '@react-native-community/datetimepicker'
 * are required for your local project environment to function correctly.
 */

export default function AddUpdateTransaction({setIsModalVisibleCallback, editTransaction}) {
  const {saveLoadingState, createTransaction, updateTransaction, getTransactions, deleteTransaction} = useTransactionCreateUdpateDelete();
  const {getCategories} = useCategoryCRUD();
  const {getRecurringTransactiosn} = useGetRecurringTransactions();

  const [transactionType, setTransactionType] = useState('Expense'); 
  const [transactionId, setTransactionId] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [recurringTransaction, setRecurringTransaction] = useState("");
  const [recurringTransactionId, setRecurringTransactionId] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [recurringTransactionList, setRecurringTransactionList] = useState([]);
  const [recurringTransactionListCategoryFiltered, setRecurringTransactionListCategoryFiltered] = useState([]);
  
  // UI Control State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showRecurringTransactionDropdown, setShowRecurringTransactionDropdown] = useState(false);

  useEffect(() => {
    getCategories(setCategoryList);
    getRecurringTransactiosn(setRecurringTransactionList);

    if(editTransaction !== null && editTransaction !== undefined)
    {
      if(editTransaction.transactionType === 1){
        setTransactionType('Expense');
      }
      else{
        setTransactionType('Income');
      }
      
      setTransactionId(editTransaction.id);
      setCategory(editTransaction.category);
      setCategoryId(editTransaction.categoryId);
      setName(editTransaction.name);
      setAmount(Math.abs(editTransaction.amount).toString());

      if(editTransaction.recurringItemId !== null && editTransaction.recurringItemId !== undefined && editTransaction.recurringItemId !== '')
      {
        setRecurringTransactionId(editTransaction.recurringItemId);

        let foundRecItem = recurringTransactionList.find((item) => {return item.recurringItemId == editTransaction.recurringItemId});

        if(foundRecItem !== undefined && foundRecItem !== null)
        {
          setRecurringTransaction(foundRecItem.recurringItemName);
        }
      }

      setDate(new Date(editTransaction.dateVal));
    }
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // On Android, the picker closes after selection automatically
    if (Platform.OS === 'android') setShowDatePicker(false);
    setDate(currentDate);
  };

  const selectCategory = (cat) => {
    setCategory(cat.categoryName);
    setCategoryId(cat.id);
    setRecurringTransaction("");
    setRecurringTransactionId("");
    setShowCatDropdown(false);

    setRecurringTransactionListCategoryFiltered(recurringTransactionList.filter((recTran) => {return recTran.categoryId === cat.id}));
  };

  const selectRecurringTransaction = (recTran) => {
    setRecurringTransaction(recTran.recurringItemName);
    setRecurringTransactionId(recTran.recurringItemId);
  };

  const handleSave = () => {

    let transactionToPost = {
      id: transactionId,
      categoryId: categoryId,
      description: name,
      amount: Math.abs(amount),
      transactionType: transactionType === 'Expense' ? 1 : 0,
      recurringItemId: recurringTransactionId,
      transactionDateTime: date
    };

    if(transactionId === undefined || transactionId === null)
      createTransaction(transactionToPost);
    else
      updateTransaction(transactionToPost);

    setIsModalVisibleCallback(false);
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
    >
        <View style={styles.modalContent}>
        
        {/* Modal Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsModalVisibleCallback(false)}>
            <X size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Transaction Details</Text>
            <TouchableOpacity onPress={handleSave}>
            <Check size={24} color="#6366f1" />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* 1. Toggle Switch */}
            <View style={styles.toggleContainer}>
            <TouchableOpacity 
                style={[styles.toggleBtn, transactionType === 'Expense' && styles.toggleBtnActiveExpense]}
                onPress={() => setTransactionType('Expense')}
            >
                <Text style={[styles.toggleText, transactionType === 'Expense' && styles.toggleTextActive]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.toggleBtn, transactionType === 'Income' && styles.toggleBtnActiveIncome]}
                onPress={() => setTransactionType('Income')}
            >
                <Text style={[styles.toggleText, transactionType === 'Income' && styles.toggleTextActive]}>Income</Text>
            </TouchableOpacity>
            </View>

            {/* 2. Name Input */}
            <Text style={styles.label}>Transaction Name</Text>
            <View style={styles.inputWrapper}>
            <FileText size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
                style={styles.textInput}
                placeholder="e.g. Office Lunch"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#cbd5e1"
            />
            </View>

            {/* 3. Amount Input */}
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputWrapper}>
            <DollarSign size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
                style={styles.textInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor="#cbd5e1"
            />
            </View>

            {/* 4. Date Picker */}
            <Text style={styles.label}>Transaction Date</Text>
            <TouchableOpacity 
            style={styles.inputWrapper} 
            onPress={() => setShowDatePicker(true)}
            >
            <Calendar size={18} color="#6366f1" style={styles.inputIcon} />
            <Text style={styles.valueText}>{formatDate(date)}</Text>
            <ChevronDown size={18} color="#94a3b8" />
            </TouchableOpacity>

            {/* 5. Category Dropdown */}
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity 
            style={styles.inputWrapper} 
            onPress={() => {
                setShowCatDropdown(!showCatDropdown);
                setShowRecurringTransactionDropdown(false);
            }}
            >
            <Tag size={18} color="#6366f1" style={styles.inputIcon} />
            <Text style={[styles.valueText, !category && styles.placeholderText]}>
                {category || "Select Category"}
            </Text>
            <ChevronDown size={18} color="#94a3b8" />
            </TouchableOpacity>

            {showCatDropdown && (
            <View style={styles.dropdown}>
                {categoryList.map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.dropdownItem} onPress={() => selectCategory(cat)}>
                    <Text style={styles.dropdownItemText}>{cat.categoryName}</Text>
                </TouchableOpacity>
                ))}
            </View>
            )}

            {/* 6. RecurringTransaction Dropdown */}
            <Text style={styles.label}>Recurring Transaction</Text>
            <TouchableOpacity 
            style={[styles.inputWrapper, !category && styles.disabledInput]} 
            onPress={() => {
                if(category) {
                setShowRecurringTransactionDropdown(!showRecurringTransactionDropdown);
                setShowCatDropdown(false);
                }
            }}
            disabled={!category}
            >
            <Layers size={18} color={category ? "#6366f1" : "#cbd5e1"} style={styles.inputIcon} />
            <Text style={[styles.valueText, !recurringTransaction && styles.placeholderText]}>
                {recurringTransaction || (category ? "Select Recurring Transaction" : "Choose a Category first")}
            </Text>
            <ChevronDown size={18} color="#94a3b8" />
            </TouchableOpacity>

            {showRecurringTransactionDropdown && category && (
            <View style={styles.dropdown}>
                {recurringTransactionListCategoryFiltered.map((recTran) => (
                <TouchableOpacity 
                    key={recTran.recurringItemId} 
                    style={styles.dropdownItem} 
                    onPress={() => { selectRecurringTransaction(recTran); setShowRecurringTransactionDropdown(false); }}
                >
                    <Text style={styles.dropdownItemText}>{recTran.recurringItemName}</Text>
                </TouchableOpacity>
                ))}
            </View>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>

        {/* Platform Specific Date Pickers */}
        {showDatePicker && Platform.OS === 'android' && (
            <DateTimePicker 
            value={date} 
            mode="date" 
            display="default" 
            onChange={handleDateChange} 
            />
        )}

        {showDatePicker && Platform.OS === 'ios' && (
            <Modal transparent animationType="fade">
            <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerBox}>
                <DateTimePicker 
                    value={date} 
                    mode="date" 
                    display="spinner" 
                    onChange={handleDateChange} 
                />
                <TouchableOpacity 
                    style={styles.doneBtn} 
                    onPress={() => setShowDatePicker(false)}
                >
                    <Text style={styles.doneBtnText}>Confirm Date</Text>
                </TouchableOpacity>
                </View>
            </View>
            </Modal>
        )}

        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  triggerBtn: { backgroundColor: '#6366f1', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16 },
  triggerBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: 'white', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20
  },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 24, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9' 
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  scrollContent: { padding: 24 },

  toggleContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#f1f5f9', 
    borderRadius: 16, 
    padding: 4, 
    marginBottom: 28 
  },
  toggleBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  toggleBtnActiveExpense: { backgroundColor: '#ef4444' },
  toggleBtnActiveIncome: { backgroundColor: '#10b981' },
  toggleText: { fontWeight: '700', color: '#64748b', fontSize: 15 },
  toggleTextActive: { color: 'white' },

  label: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    marginBottom: 8, 
    marginTop: 16,
    letterSpacing: 0.5
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    borderWidth: 1.5, 
    borderColor: '#e2e8f0', 
    borderRadius: 14, 
    paddingHorizontal: 16, 
    height: 60 
  },
  disabledInput: { backgroundColor: '#f1f5f9', borderColor: '#f1f5f9' },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: '#1e293b', fontWeight: '600' },
  valueText: { flex: 1, fontSize: 16, color: '#1e293b', fontWeight: '600' },
  placeholderText: { color: '#cbd5e1', fontWeight: '400' },

  dropdown: { 
    backgroundColor: 'white', 
    borderRadius: 14, 
    marginTop: 8, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 1000
  },
  dropdownItem: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  dropdownItemText: { fontSize: 16, color: '#334155', fontWeight: '500' },

  iosPickerContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20 },
  iosPickerBox: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
  doneBtn: { backgroundColor: '#6366f1', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  doneBtnText: { color: 'white', fontWeight: '700', fontSize: 16 }
});