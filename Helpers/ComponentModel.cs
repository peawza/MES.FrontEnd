namespace WEB.APP.Helpers
{
    public class DataObjectValidationResult<T>
       where T : class
    {
        public DataObjectValidationResult(T data)
        {
            this.Data = data;
        }
        /// <summary>
        /// 
        /// </summary>
        public T Data { get; private set; }
        /// <summary>
        /// 
        /// </summary>
        public IList<string> Messages { get; private set; } = new List<string>();
        /// <summary>
        /// 
        /// </summary>
        public bool IsValid => this.Messages.Count == 0;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="message"></param>
        public void Add(string message)
        {
            this.Messages.Add(message);
        }

        public Exception CreateException(string message = "Invalid data object")
        {
            return new InvalidDataObjectException(this.Data, message, this.Messages.ToArray());
        }

        public Exception CreateFirstException(string message = "Invalid data object")
        {
            return new InvalidDataObjectException(this.Data, this.Messages.Any() ? this.Messages.First() : message);
        }

        public Exception[] GetErrors()
        {
            if (!this.IsValid)
            {
                return Messages.Select(t => new Exception(t)).ToArray();
            }
            return null;
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public class DataObjectValidationResults<T>
        where T : class
    {
        /// <summary>
        /// 
        /// </summary>
        public Dictionary<T, string[]> Messages { get; private set; } = new Dictionary<T, string[]>();
        /// <summary>
        /// 
        /// </summary>
        public bool IsValid => this.Messages.Count == 0;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="message"></param>
        public void Add(T data, string[] messages)
        {
            this.Messages.Add(data, messages);
        }
    }

    public class InvalidDataObjectException : Exception
    {
        public InvalidDataObjectException(object data, string message) : base(message)
        {

        }

        public InvalidDataObjectException(object data, string message, string[] validationMessages) : base(message)
        {
            this.ValidationMessages = validationMessages;
        }

        public string[] ValidationMessages { get; private set; }
    }
}
