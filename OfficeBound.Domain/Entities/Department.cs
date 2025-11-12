namespace OfficeBound.Domain.Entities;

public class Department : BaseEntity
{
    public required string DepartmentName { get; set; }
    
    public int? ManagerId { get; set; }
    
    public User? Manager { get; set; }
    
    public int NumberOfPeople { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public string? RejectionReason { get; set; }
    
    public ICollection<User> Users { get; set; } = new List<User>();
}

