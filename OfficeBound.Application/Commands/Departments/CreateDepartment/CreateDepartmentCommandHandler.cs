using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Departments.CreateDepartment;

public class CreateDepartmentCommandHandler : IRequestHandler<CreateDepartmentCommand, int>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    
    public CreateDepartmentCommandHandler(IDepartmentRepository departmentRepository, IUnitOfWork unitOfWork)
    {
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<int> Handle(CreateDepartmentCommand command, CancellationToken cancellationToken)
    {
        var department = new Department
        {
            DepartmentName = command.DepartmentName,
            Manager = command.Manager,
            NumberOfPeople = command.NumberOfPeople,
            CreatedDate = DateTime.UtcNow
        };

        await _departmentRepository.AddAsync(department, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return department.Id;
    }
}

