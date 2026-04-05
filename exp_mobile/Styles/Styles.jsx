import {
  StyleSheet,
  Platform,
} from 'react-native';

const THEME = {
  colors: {
    primary: '#2563eb', // Blue 600
    secondary: '#4f46e5', // Indigo 600
    success: '#10b981', // Emerald 500
    danger: '#f43f5e', // Rose 500
    background: '#f8fafc', // Slate 50
    surface: '#ffffff',
    textPrimary: '#0f172a', // Slate 900
    textSecondary: '#64748b', // Slate 500
    cardDark: '#1e293b', // Slate 800
    border: '#e2e8f0', // Slate 200
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 30,
    full: 9999,
  }
};

const Styles = StyleSheet.create({
  s: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  addButton: {
    backgroundColor: THEME.colors.primary,
    width: 52,
    height: 52,
    borderRadius: THEME.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  refreshButtonWhite: {
    backgroundColor: THEME.colors.cardDark,
    color: THEME.colors.background,
    width: 52,
    height: 52,
    borderRadius: THEME.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  refreshButtonDark: {
    backgroundColor: THEME.colors.background,
    color: THEME.colors.textPrimary,
    width: 52,
    height: 52,
    borderRadius: THEME.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  mainCard: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: THEME.spacing.xs,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  balanceAmountSmall: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: THEME.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.xl,
  },
  quickAction: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.lg,
    alignItems: 'center',
    width: '30%',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  qaIcon: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  qaText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  seeAllText: {
    color: THEME.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  transactionCard: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  transactionMeta: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radius.md,
    padding: 4,
    marginBottom: THEME.spacing.lg,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: THEME.radius.sm,
  },
  typeBtnActive: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  typeBtnTextActive: {
    color: THEME.colors.textPrimary,
  },
  inputGroup: {
    marginBottom: THEME.spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.sm,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    fontSize: 16,
    color: THEME.colors.textPrimary,
  },
  saveButton: {
    backgroundColor: THEME.colors.primary,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
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
  dropdownItemText: { fontSize: 16, color: '#334155', fontWeight: '500' }
});

export {Styles, THEME};