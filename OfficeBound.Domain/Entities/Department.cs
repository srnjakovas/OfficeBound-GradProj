namespace OfficeBound.Domain.Entities;

public class Department : BaseEntity
{
    public required string DepartmentName { get; set; }
    
    public required string Manager { get; set; }
    
    public int NumberOfPeople { get; set; }
    
    public ICollection<User> Users { get; set; } = new List<User>();
}

