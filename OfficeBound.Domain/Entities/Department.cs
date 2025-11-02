namespace OfficeBound.Domain.Entities;

public class Department : BaseEntity
{
    public string DepartmentName { get; set; }
    
    public string Manager { get; set; }
    
    public int NumberOfPeople { get; set; }
    
    // One-to-many relationship with User
    public ICollection<User> Users { get; set; } = new List<User>();
}

