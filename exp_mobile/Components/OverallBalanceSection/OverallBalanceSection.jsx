import {APP_EVENT_CONSTANTS} from '../../Constants/ApplicationEventConstants.jsx';

import {
  View,
  Text,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';

import {Styles, THEME} from '../../Styles/Styles.jsx';

import {
  ArrowUpRight, 
  ArrowDownLeft,
  RefreshCcw
} from 'lucide-react-native';

import {useState, useEffect} from 'react';

import useGetMonthlyBudget from '../../Hooks/useGetMonthlyBudget.jsx';

const OverallBalanceSection = ({ total, income, expense }) => {
    
    const [monthlyBudgetSummaryData, setMonthlyBudgetSummaryData] = useState({
        totalRunningExpenses: 0.00,
        totalRunningExpensesExpected: 0.00,
        dailyRemainingBudget: 0.00,
        totalDailyExpenses: 0.00,
        totalDailyBudget: 0.00
        ,
        currentWeeklyRemainingBudget: {
            weeklyRemainingBudget: 0.00,
            weeklyTotalExpenses: 0.00,
            weeklyExpectedExpenses: 0.00,
            weeklyPlannedBudget: 0.00
        }
        ,
        monthlyRemainingBudget: 0.00,
        totalMonthlyExpenses: 0.00,
        totalRunningExpensesExpected: 0.00,
        totalMonthlyBudget: 0.00
    });
    const {getMonthlyBudgetDetails, getMonthlyBudgetSummary} = useGetMonthlyBudget();
    
    useEffect(() => {
        getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);

        const transactionUdpateEventSubscription = DeviceEventEmitter.addListener(APP_EVENT_CONSTANTS.TRANSACTION_ADD_EVENT, (data) => {
            getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);
        });

        // 2. IMPORTANT: Clean up the listener on unmount to prevent memory leaks
        return () => {
            transactionUdpateEventSubscription.remove();
        };
    }, []);
    
    const refreshOverallBalanceData = async () => {
        getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);
    };

    return (
    <View style={Styles.mainCard}>
        <View style={Styles.headerContainer}>
            <Text style={Styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={() => refreshOverallBalanceData()}>
                <RefreshCcw style={Styles.refreshButtonWhite} />
            </TouchableOpacity>
        </View>
        <Text style={Styles.balanceAmount}>RM{Math.abs(monthlyBudgetSummaryData?.totalRunningExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        <Text style={Styles.balanceAmountSmall}>RM{monthlyBudgetSummaryData?.totalRunningExpensesExpected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        
        <View style={Styles.divider} />
        
        <Text style={Styles.balanceAmountSmall}>Daily</Text>
        <Text style={Styles.balanceAmountSmall}>Balance: {monthlyBudgetSummaryData?.dailyRemainingBudget}</Text>
        <View style={Styles.statsRow}>
            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <ArrowDownLeft size={16} color={THEME.colors.success} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Expense</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.success }]}>RM{Math.abs(monthlyBudgetSummaryData?.totalDailyExpenses).toLocaleString()}</Text>
                </View>
            </View>

            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.2)' }]}>
                <ArrowUpRight size={16} color={THEME.colors.danger} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Expected</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.danger }]}>RM{monthlyBudgetSummaryData?.totalDailyBudget.toLocaleString()}</Text>
                </View>
            </View>

            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.2)' }]}>
                <ArrowUpRight size={16} color={THEME.colors.danger} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Total Planned</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.danger }]}>RM{monthlyBudgetSummaryData?.totalDailyBudget.toLocaleString()}</Text>
                </View>
            </View>
        </View>
        <View style={Styles.divider} />
        <Text style={Styles.balanceAmountSmall}>Weekly</Text>
        <Text style={Styles.balanceAmountSmall}>Balance: {monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyRemainingBudget}</Text>
        <View style={Styles.statsRow}>
            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <ArrowDownLeft size={16} color={THEME.colors.success} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Expense</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.success }]}>RM{Math.abs(monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyTotalExpenses).toLocaleString()}</Text>
                </View>
            </View>

            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.2)' }]}>
                <ArrowUpRight size={16} color={THEME.colors.danger} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Expected</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.danger }]}>RM{monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyExpectedExpenses.toLocaleString()}</Text>
                </View>
            </View>

            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.2)' }]}>
                <ArrowUpRight size={16} color={THEME.colors.danger} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Total Planned</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.danger }]}>RM{monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyPlannedBudget.toLocaleString()}</Text>
                </View>
            </View>
        </View>
        <View style={Styles.divider} />
        <Text style={Styles.balanceAmountSmall}>Monthly</Text>
        <Text style={Styles.balanceAmountSmall}>Balance: {monthlyBudgetSummaryData?.monthlyRemainingBudget}</Text>
        <View style={Styles.statsRow}>
            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <ArrowDownLeft size={16} color={THEME.colors.success} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Expense</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.success }]}>RM{Math.abs(monthlyBudgetSummaryData?.totalMonthlyExpenses).toLocaleString()}</Text>
                </View>
            </View>

            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.2)' }]}>
                <ArrowUpRight size={16} color={THEME.colors.danger} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Expected</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.danger }]}>RM{monthlyBudgetSummaryData?.totalRunningExpensesExpected.toLocaleString()}</Text>
                </View>
            </View>

            <View style={Styles.statItem}>
                <View style={[Styles.iconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.2)' }]}>
                <ArrowUpRight size={16} color={THEME.colors.danger} />
                </View>
                <View>
                <Text style={Styles.statLabel}>Total Planned</Text>
                <Text style={[Styles.statValue, { color: THEME.colors.danger }]}>RM{monthlyBudgetSummaryData?.totalMonthlyBudget.toLocaleString()}</Text>
                </View>
            </View>
        </View>
    </View>
)};

// const OverallBalanceSection_Web = () => {
    
//     const [monthlyBudgetSummaryData, setMonthlyBudgetSummaryData] = useState({});
//     const {getMonthlyBudgetDetails, getMonthlyBudgetSummary} = useGetMonthlyBudget();

//     useEffect(() => {
//         getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);
//     }, []);

//     return(
//     <div className="balance-section">
//         <div className="balance-header">
//             <div>
//                 <p className="balance-title">Expenses Up To Date</p>
//                 <h2 className={`balance-amount RM{(Math.abs(monthlyBudgetSummaryData?.totalRunningExpenses) > monthlyBudgetSummaryData?.totalRunningExpensesExpected ? ' text-red-300' : '')}`}>
//                     {formatCurrency(Math.abs(monthlyBudgetSummaryData?.totalRunningExpenses))} / {formatCurrency(monthlyBudgetSummaryData?.totalRunningExpensesExpected)}
//                 </h2>

//                 <h2 className={`balance-amount text-s RM{(Math.abs(monthlyBudgetSummaryData?.totalRunningExpensesOverall) > monthlyBudgetSummaryData?.totalRunningExpensesExpectedOverall ? ' text-red-300' : '')}`}>
//                     {formatCurrency(Math.abs(monthlyBudgetSummaryData?.totalRunningExpensesOverall))} / {formatCurrency(monthlyBudgetSummaryData?.totalRunningExpensesExpectedOverall)}
//                 </h2>
//             </div>
//         </div>

//         {/* Time-Based Balances (Daily, Weekly, Monthly) */}
//         <div className="metric-grid">
//             {[
//                 {
//                     title: 'Daily Net',
//                     reamining: monthlyBudgetSummaryData?.dailyRemainingBudget,
//                     planned: monthlyBudgetSummaryData?.totalDailyBudget,
//                     expenses: Math.abs(monthlyBudgetSummaryData?.totalDailyExpenses),
//                     expectedExpenses: 0.00,
//                     icon: Calendar
//                 },
//                 { 
//                     title: 'Weekly Net',
//                     reamining: monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyRemainingBudget,
//                     planned: monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyPlannedBudget,
//                     expenses: Math.abs(monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyTotalExpenses),
//                     expectedExpenses: monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyExpectedExpenses,
//                     icon: Clock 
//                 },
//                 {
//                     title: 'Monthlply Net',
//                     reamining: monthlyBudgetSummaryData?.monthlyRemainingBudget,
//                     planned: monthlyBudgetSummaryData?.totalMonthlyBudget,
//                     expenses: Math.abs(monthlyBudgetSummaryData?.totalMonthlyExpenses),
//                     expectedExpenses: monthlyBudgetSummaryData?.totalRunningExpensesExpected,
//                     icon: BarChart2
//                 },
//             ].map((metric) => {
//                 const isPositive = metric.reamining >= 0;
//                 return (
//                     <div key={metric.title} className="metric-item">
//                         <div>
//                             <p className="metric-title">{metric.title}</p>
//                             <p className={`metric-value RM{isPositive ? 'text-green-300' : 'text-red-300'}`}>
//                                 Bal: {formatCurrency(metric.reamining)}
//                             </p>
//                             <p className='text-s'>Exp: [{formatCurrency(metric.expenses)} / {formatCurrency(metric.expectedExpenses)} / {formatCurrency(metric.planned)}]</p>
//                         </div>
//                         <metric.icon className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem', color: '#93c5fd', opacity: 0.6 }} />
//                     </div>
//                 );
//             })}
//         </div>
//     </div>
// )};

export default OverallBalanceSection;