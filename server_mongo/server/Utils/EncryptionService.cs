using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Server.Utils
{
    public static class EncryptionService
    {
        private const string _staticSalt = "78a9sdf76ass89213=";

        public static string GenerateNewSaltKey()
        {
            string salt = GenerateHash(RandomNumberGenerator.GetHexString(10, false), _staticSalt);
            return salt;
        }

        public static byte[] GetStringByteArray(string input)
        {
            return Encoding.ASCII.GetBytes(input);
        }

        public static string GenerateHash(string input, string salt)
        {
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: input!,
                salt: GetStringByteArray(salt),
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            return hashed;
        }
    }
}
