namespace OfficeBound.Contracts.Dtos;

public record DepartmentDto(int Id, string DepartmentName, int? ManagerId, string? ManagerName, int NumberOfPeople, DateTime CreatedDate);

