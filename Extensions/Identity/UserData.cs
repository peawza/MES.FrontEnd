using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace WEB.APP.Extensions.Identity
{
    public class UserData
    {
        public UserData()
        {

        }

        public UserData(Dictionary<string, int[]> permissions)
        {
            Permissions = permissions;
        }

        public int Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string DepartmentNo { get; set; }
        public string DepartmentName { get; set; }
        public string PositionNo { get; set; }
        public string PositionName { get; set; }

        public string Team { get; set; }

        public Dictionary<string, int[]> Permissions { get; private set; } = new Dictionary<string, int[]>();
        [JsonIgnore]
        public string DisplayName => $"{FirstName} {LastName?.Substring(0, 1)}" + ".";
    }
}
