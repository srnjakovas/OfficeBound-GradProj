namespace OfficeBound.Contracts.Requests;

public record UpdateDepartment(string DepartmentName, int? ManagerId, int NumberOfPeople, int? UserId);

