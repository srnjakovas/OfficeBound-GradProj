namespace OfficeBound.Contracts.Requests;

public record CreateDepartment(string DepartmentName, int? ManagerId, int NumberOfPeople);

