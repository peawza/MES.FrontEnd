using Microsoft.AspNetCore.Identity;

namespace WEB.APP.Extensions.Identity
{
    public class ApplicationRole : IdentityRole<int>
    {
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public string CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public string UpdateBy { get; set; }
        public DateTime UpdateDate { get; set; }

        public ICollection<ApplicationUserRole> UserRoles { get; set; }
    }
}
