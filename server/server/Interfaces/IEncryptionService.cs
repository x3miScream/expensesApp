namespace Server.Interfaces;

public interface IEncryptionService{
    public string GenerateNewSaltKey();
    public byte[] GetStringByteArray(string input);
    public string GenerateHash(string input, string salt);
}