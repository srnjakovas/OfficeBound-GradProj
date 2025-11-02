namespace OfficeBound.Contracts.Dtos;

public record UserAccountRequestDto(
    int Id,
    string Username,
    bool IsReviewed,
    bool IsApproved,
    DateTime CreatedDate,
    DateTime? ReviewedDate
);

