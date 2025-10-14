using System.Reflection;
using System.Reflection.Metadata;
using MongoDB.Bson;

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





    public static class ObjectIdConverter
    {
        public static ObjectId ConvertStringToObjectId(this string objectIdString)
        {
            if (ObjectId.TryParse(objectIdString, out ObjectId objectId))
            {
                return objectId;
            }
            else
            {
                // Handle invalid string format, e.g., throw an exception or return a default value
                throw new ArgumentException("Invalid ObjectId string format.", nameof(objectIdString));
            }
        }
    }
}
