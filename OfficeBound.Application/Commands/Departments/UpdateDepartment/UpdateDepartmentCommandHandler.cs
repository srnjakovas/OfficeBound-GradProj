using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Departments.UpdateDepartment;

public class UpdateDepartmentCommandHandler : IRequestHandler<UpdateDepartmentCommand, Unit>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateDepartmentCommandHandler(IDepartmentRepository departmentRepository, IUnitOfWork unitOfWork)
    {
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<Unit> Handle(UpdateDepartmentCommand command, CancellationToken cancellationToken)
    {
        var department = await _departmentRepository.GetByIdAsync(command.Id, cancellationToken);

        if (department is null)
        {
            throw new NotFoundException($"{nameof(Department)} with Id: {command.Id} was not found in Database");
        }

        department.DepartmentName = command.DepartmentName;
        department.Manager = command.Manager;
        department.NumberOfPeople = command.NumberOfPeople;

        await _departmentRepository.UpdateAsync(department, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}

