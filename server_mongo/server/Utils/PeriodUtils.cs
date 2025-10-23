namespace Server.Utils
{
    public static class PeriodUtils
    {
        public static int GetCurrentPeriod()
        {
            DateTime nowDateTime = DateTime.Now;

            int year = nowDateTime.Year;
            int month = nowDateTime.Month;

            return ((year * 100) + month);
        }
    }
}
