using OfficeBound.Contracts.Dtos;

namespace OfficeBound.Contracts.Responses;

public record GetDepartmentsResponse(List<DepartmentDto> DepartmentsDtos);

