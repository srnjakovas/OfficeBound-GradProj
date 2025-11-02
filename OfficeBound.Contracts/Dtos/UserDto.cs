namespace OfficeBound.Contracts.Dtos;

public record UserDto(
    int Id,
    string Username,
    string? Position,
    int? DepartmentId,
    string? DepartmentName,
    int Role,
    bool IsApproved,
    DateTime CreatedDate
);

