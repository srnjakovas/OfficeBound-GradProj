using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Domain.Entities;

public class Request : BaseEntity
{
    public string Description { get; set; }

    public string? RejectionReason { get; set; }
    
    public RequestType RequestType { get; set; }

    public DateTime RequestDate { get; set; }

    public RequestStatus RequestStatus { get; set; } = RequestStatus.Pending;
}