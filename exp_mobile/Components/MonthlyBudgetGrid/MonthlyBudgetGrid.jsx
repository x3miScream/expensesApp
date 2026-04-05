import { useState, useEffect } from 'react';
import {APP_EVENT_CONSTANTS} from '../../Constants/ApplicationEventConstants.jsx';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';

import {
  RefreshCcw
} from 'lucide-react-native';

import {Styles, THEME} from '../../Styles/Styles.jsx';

import useGetMonthlyBudget from '../../Hooks/useGetMonthlyBudget.jsx';

// --- MOCK UTILS & HOOKS FOR PREVIEW ---
// In your local project, replace these with your actual imports:
// import { formatCurrency } from '../../Utils/Utils.jsx';
// import SummaryRow from './SummaryRow.jsx';
// import useGetMonthlyBudget from '../../Hooks/useGetMonthlyBudget.jsx';

const formatCurrency = (amount) => {  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount || 0);
};

const SummaryRow = ({ title, value, valueClassName, isBudget, totalAllocation }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{title}</Text>
    <View style={{ alignItems: 'flex-end' }}>
      <Text style={[styles.summaryValue, valueClassName ? { color: valueClassName.includes('red') ? '#ef4444' : valueClassName.includes('green') ? '#10b981' : '#4f46e5' } : {}]}>
        {formatCurrency(value)}
      </Text>
      {isBudget && totalAllocation && (
        <Text style={{ fontSize: 10, color: '#94a3b8' }}>of {formatCurrency(totalAllocation)}</Text>
      )}
    </View>
  </View>
);


/**
 * MonthlyBudgetGrid - React Native Version
 */
const MonthlyBudgetGrid = ({ months }) => {
  const [monthlyBudgetData, setMonthlyBudgetData] = useState([]);
  const [monthlyBudgetSummaryData, setMonthlyBudgetSummaryData] = useState({});
  const { getMonthlyBudgetDetails, getMonthlyBudgetSummary } = useGetMonthlyBudget();

  useEffect(() => {
    getMonthlyBudgetDetails(setMonthlyBudgetData);
    getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);

    const transactionUdpateEventSubscription = DeviceEventEmitter.addListener(APP_EVENT_CONSTANTS.TRANSACTION_ADD_EVENT, (data) => {
      getMonthlyBudgetDetails(setMonthlyBudgetData);
      getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);
    });

    // 2. IMPORTANT: Clean up the listener on unmount to prevent memory leaks
    return () => {
        transactionUdpateEventSubscription.remove();
    };
  }, []);

  const currentMonth = months[0];

  const refreshMonthlyBudgetGridData = async () => {
    await getMonthlyBudgetDetails(setMonthlyBudgetData);
    await getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <View style={styles.gridCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>
              Monthly Fixed Budget & Actuals
            </Text>
            <TouchableOpacity onPress={() => refreshMonthlyBudgetGridData()}>
                <RefreshCcw style={Styles.refreshButtonDark} />
            </TouchableOpacity>
          </View>

          {/* Table Header Row */}
          <View style={styles.tableHeader}>
            <View style={{ flex: 2 }}>
              <Text style={styles.headerLabel}>ITEM / CAT</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.headerLabel}>BUDGET</Text>
            </View>
            <View style={{ flex: 1.5, marginLeft: 10 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {months.map((month) => (
                  <View key={month} style={styles.monthColHeader}>
                    <Text style={[styles.headerLabel, currentMonth === month && { color: '#4f46e5' }]}>
                      {month}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Budget Data Rows */}
          {monthlyBudgetData.map((item, index) => {
            const isUnplanned = item.recurringItemName === 'Unplanned Expenses';
            return (
              <View key={index} style={[styles.dataRow, isUnplanned && { backgroundColor: '#fff7ed' }]}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.recurringItemName}</Text>
                  <Text style={styles.categoryName}>{item.categoryName}</Text>
                </View>
                
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={styles.budgetAmount}>{formatCurrency(item.plannedBudget)}</Text>
                </View>

                <View style={{ flex: 1.5, marginLeft: 10 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {months.map((month) => {
                      const actual = item.runningAmountByPeriod?.[month];
                      const isOver = actual > item.plannedBudget;
                      return (
                        <View key={month} style={styles.monthColData}>
                          <Text style={[styles.actualAmount, isOver && styles.textDanger]}>
                            {actual ? formatCurrency(actual) : '-'}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            );
          })}

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Monthly Summary ({currentMonth})</Text>
            <SummaryRow 
              title="Planned (Budget)" 
              value={monthlyBudgetSummaryData.totalMonthlyBudget} 
            />
            <SummaryRow 
              title="Actual (Spent)" 
              value={monthlyBudgetSummaryData.totalMonthlyExpenses} 
              valueClassName="red" 
            />
            <SummaryRow 
              title="Net Remaining" 
              value={monthlyBudgetSummaryData.monthlyRemainingBudget} 
              valueClassName={monthlyBudgetSummaryData.monthlyRemainingBudget >= 0 ? 'green' : 'red'} 
            />

            <View style={styles.divider} />

            <Text style={styles.summaryTitle}>Weekly Breakdown</Text>
            {monthlyBudgetSummaryData.weeklyRemainingBudget?.map((week, index) => (
              <SummaryRow 
                key={index} 
                title={`Week RM{week.weekNumber}`} 
                value={week.weeklyRemainingBudget} 
                valueClassName={week.weeklyRemainingBudget >= 0 ? 'green' : 'red'} 
                isBudget={true}
                totalAllocation={week.weeklyPlannedBudget}
              />
            ))}

            <View style={styles.grandTotalContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL SPENT</Text>
                <Text style={[styles.totalValue, styles.textDanger]}>
                  {formatCurrency(monthlyBudgetSummaryData.totalMonthlyExpenses)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>REMAINING</Text>
                <Text style={[styles.totalValue, monthlyBudgetSummaryData.monthlyRemainingBudget >= 0 ? styles.textSuccess : styles.textDanger]}>
                  {formatCurrency(monthlyBudgetSummaryData.monthlyRemainingBudget)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  gridCard: { backgroundColor: '#fff', borderRadius: 12, borderWeight: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  cardHeader: 
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  cardHeaderText: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
  monthColHeader: { width: 80, alignItems: 'flex-end' },
  dataRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' },
  itemName: { fontSize: 13, fontWeight: '700', color: '#334155' },
  categoryName: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' },
  budgetAmount: { fontSize: 13, fontWeight: 'bold', color: '#4f46e5' },
  monthColData: { width: 80, alignItems: 'flex-end' },
  actualAmount: { fontSize: 13, color: '#475569' },
  textDanger: { color: '#ef4444', fontWeight: 'bold' },
  textSuccess: { color: '#10b981', fontWeight: 'bold' },
  summarySection: { backgroundColor: '#f8fafc', padding: 15, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  summaryTitle: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: '#64748b' },
  summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#334155' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 15 },
  grandTotalContainer: { marginTop: 10, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#e2e8f0' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  totalLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748b' },
  totalValue: { fontSize: 18, fontWeight: '900' }
});

export default MonthlyBudgetGrid;