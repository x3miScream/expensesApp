using System.ComponentModel;

namespace Server.Enums;

public enum CategoryType {
    [Description("Expense")]
    Expense,
    [Description("Income")]
    Income
}