using System.Reflection;
using System.Reflection.Metadata;

namespace Server.Utils
{
    [AttributeUsage(AttributeTargets.Class)]
    public class MongoDocumentType : Attribute
    {
        public string _DocumentType { get; } = string.Empty;

        public MongoDocumentType(string documentType)
        {
            _DocumentType = documentType;
        }

        public string GetDocumentType() => _DocumentType;
    }




    public static class MongoDocumentTypeAttributeReader
    {
        public static string GetMongoDocumentType<TTargetClass>()
        {
            // Use typeof(TTargetClass) to get the Type object for the class itself.
            var type = typeof(TTargetClass);

            // Get custom attributes of the specified type.
            var attribute = type.GetCustomAttributes(typeof(MongoDocumentType), inherit: false)
                                .FirstOrDefault() as MongoDocumentType;

            // Return the attribute's property value if the attribute was found.
            return attribute?.GetDocumentType();
        }
    }
}
