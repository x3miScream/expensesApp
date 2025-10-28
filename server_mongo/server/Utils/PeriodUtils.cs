namespace Server.Utils
{
    public static class PeriodUtils
    {
        public static int GetPeriodFromDateTime(DateTime dateTimeToGetPeriodFrom)
        {
            int date = dateTimeToGetPeriodFrom.Day;

            if (date > 27)
                dateTimeToGetPeriodFrom = dateTimeToGetPeriodFrom.AddMonths(1);

            int year = dateTimeToGetPeriodFrom.Year;
            int month = dateTimeToGetPeriodFrom.Month;

            return ((year * 100) + month);
        }


        public static int GetCurrentPeriod()
        {
            DateTime nowDateTime = DateTime.Now;
            return GetPeriodFromDateTime(nowDateTime);
        }


        public static DateTime GetPeriodStartDate(int period)
        {
            return new DateTime(period / 100, period % 100, 28).AddMonths(-1);
        }

        public static DateTime GetPeriodEndDate(int period)
        { 
            return new DateTime(period / 100, period % 100, 27);
        }
    }
}
