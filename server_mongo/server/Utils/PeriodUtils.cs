namespace Server.Utils
{
    public static class PeriodUtils
    {
        public static int GetPeriodFromDateTime(DateTime dateTimeToGetPeriodFrom)
        {
            int year = dateTimeToGetPeriodFrom.Year;
            int month = dateTimeToGetPeriodFrom.Month;

            return ((year * 100) + month);
        }


        public static int GetCurrentPeriod()
        {
            DateTime nowDateTime = DateTime.Now;
            return GetPeriodFromDateTime(nowDateTime);
        }
    }
}
