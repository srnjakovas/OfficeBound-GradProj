namespace OfficeBound.Domain.Entities;

public class Department : BaseEntity
{
    public string DepartmentName { get; set; }
    
    public string Manager { get; set; }
    
    public int NumberOfPeople { get; set; }
}

