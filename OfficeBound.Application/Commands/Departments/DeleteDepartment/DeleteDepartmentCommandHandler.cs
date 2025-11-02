using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Departments.DeleteDepartment;

public class DeleteDepartmentCommandHandler : IRequestHandler<DeleteDepartmentCommand, Unit>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteDepartmentCommandHandler(IDepartmentRepository departmentRepository, IUnitOfWork unitOfWork)
    {
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<Unit> Handle(DeleteDepartmentCommand command, CancellationToken cancellationToken)
    {
        var department = await _departmentRepository.GetByIdAsync(command.Id, cancellationToken);

        if (department is null)
        {
            throw new NotFoundException($"{nameof(Department)} with Id: {command.Id} was not found in Database");
        }

        await _departmentRepository.DeleteAsync(department, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}

