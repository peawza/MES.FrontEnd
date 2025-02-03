namespace WEB.APP.Localization
{
    public class ApiResult<T>
    {
        public int Status { get; set; }
        public T? Data { get; set; }
    }
    public class ResourceMessage
    {
        public string? MessageCode { get; set; }
        public string? MessageType { get; set; }
        public string? MessageNameTH { get; set; }
        public string? MessageNameEN { get; set; }
        //public string? Remark { get; set; }
        //public DateTime? CreateDate { get; set; }

        //public string? CreateBy { get; set; }


    }
    public class LocalizedResources_model
    {
        public string? ScreenCode { get; set; }
        public string? ObjectID { get; set; }
        public string? ResourcesTH { get; set; }
        public string? ResourcesEN { get; set; }
        public string? MessageName { get; set; }

    }

    public class LocalizedResources
    {
        public string? ScreenCode { get; set; }
        public string? ObjectID { get; set; }
        public string? ResourcesTH { get; set; }
        public string? ResourcesEN { get; set; }

        //public string? Remark { get; set; }
        //public DateTime? CreateDate { get; set; }

        //public string? CreateBy { get; set; }


    }
}


