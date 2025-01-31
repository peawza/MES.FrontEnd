using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace WEB.APP.Extensions.Identity
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string EmployeeCode { get; set; }
        [Required]
        [PersonalData]
        public string FirstName { get; set; }

        [Required]
        [PersonalData]
        public string LastName { get; set; }

        public string? Prefix { get; set; }
        public string? NormalizedUserName { get; set; }
        public string? PrefixTH { get; set; }
        public string? FullNameTH { get; set; }
        public string? FullNameEN { get; set; }
        public string? PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;

        // [Required]
        [PersonalData]
        public string DepartmentNo { get; set; }



        public string SectionCode { get; set; }

        [Required]
        [PersonalData]
        public string PositionNo { get; set; }



        public bool IsActive { get; set; }

        public DateTime? LastChangedPassword { get; set; }

        public DateTime? LastSignedIn { get; set; }



        public string LanguageCode { get; set; }
        public DateTime CreateDate { get; set; }

        [Required]
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        [Required]
        public string UpdateBy { get; set; }

        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }

        public dynamic GetPersonalData()
        {
            return new { FirstName, LastName, PositionNo, DepartmentNo, };
        }


    }
}
