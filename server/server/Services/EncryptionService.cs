using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using Server.Interfaces;
using System.Text;

namespace Server.Services;

public class EncryptionService : IEncryptionService{
    private const string _staticSalt = "78a9sdf76ass89213=";

    public string GenerateNewSaltKey(){
        // byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
        // return Encoding.ASCII.GetString(salt);

        string salt = GenerateHash(RandomNumberGenerator.GetHexString(10, false), _staticSalt);
        return salt;
    }

    public byte[] GetStringByteArray(string input){
        return Encoding.ASCII.GetBytes(input);
    }

    public string GenerateHash(string input, string salt){
        string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: input!,
            salt: GetStringByteArray(salt),
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8));

        return hashed;
    }
}