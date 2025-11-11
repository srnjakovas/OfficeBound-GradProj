using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Domain.Entities;

public class User : BaseEntity
{
    public required string Username { get; set; }
    
    public required string Password { get; set; }
    
    public Role Role { get; set; } = Role.User;
    
    public string? Position { get; set; }
    
    public int? DepartmentId { get; set; }
    
    public Department? Department { get; set; }
    
    public bool IsApproved { get; set; } = false;
    
    public DateTime? ReviewedDate { get; set; }
    
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}

