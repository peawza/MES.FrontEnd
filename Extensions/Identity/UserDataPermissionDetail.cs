using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;


#nullable disable

namespace WEB.APP.Extensions.Identity
{
    public partial class UserDataPermissionDetail
    {
        public Guid Id { get; set; }
        public int HeaderId { get; set; }
        public string Username { get; set; }
        public bool IsEmailAlert { get; set; }
        public DateTime CreateDateTime { get; set; }
        public string CreateBy { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public string UpdateBy { get; set; }

        public virtual UserDataPermissionHeader Header { get; set; }

        //[NotMapped]
        //public bool IsPersistence { get; set; } = true;
        //[NotMapped]
        //public EntityDataState DataState { get; set; } = EntityDataState.None;
    }
}
