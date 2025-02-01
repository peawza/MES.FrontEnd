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
    }
}
