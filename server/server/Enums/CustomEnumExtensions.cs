using System.ComponentModel;
using System.Reflection;

namespace Server.Enums;

public static class CustomEnumExtensions{
    public static string GetEnumDescription(this Enum value)
    {
        string defaultValue = value.ToString().ToUpper();
        FieldInfo fi = value?.GetType()?.GetField(value?.ToString());

        if(fi == null)
            return defaultValue;

        DescriptionAttribute[] attributes = fi.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

        if(attributes == null || !attributes.Any())
            return defaultValue;

        return attributes.FirstOrDefault().Description;
    }
}