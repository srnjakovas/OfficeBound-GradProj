namespace OfficeBound.Domain.Entities;

public class UserAccountRequest : BaseEntity
{
    public string Username { get; set; }
    
    public string Password { get; set; } // Will be hashed
    
    public bool IsReviewed { get; set; } = false;
    
    public bool IsApproved { get; set; } = false;
    
    public DateTime? ReviewedDate { get; set; }
}

