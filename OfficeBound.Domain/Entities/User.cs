using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; set; }
    
    public string Password { get; set; } // Should be hashed
    
    public Role Role { get; set; } = Role.User;
    
    public string? Position { get; set; }
    
    public int? DepartmentId { get; set; }
    
    public Department? Department { get; set; }
    
    public bool IsApproved { get; set; } = false;
    
    // Many-to-many relationship with Request
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}

