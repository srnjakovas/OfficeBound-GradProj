using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Departments.CreateDepartment;

public class CreateDepartmentCommandHandler : IRequestHandler<CreateDepartmentCommand, int>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    
    public CreateDepartmentCommandHandler(
        IDepartmentRepository departmentRepository, 
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _departmentRepository = departmentRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<int> Handle(CreateDepartmentCommand command, CancellationToken cancellationToken)
    {
        var errors = new List<Contracts.Errors.ValidationError>();

        if (command.ManagerId.HasValue)
        {
            var existingDepartment = await _departmentRepository.GetByManagerIdAsync(command.ManagerId.Value, cancellationToken);
            if (existingDepartment != null)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(CreateDepartmentCommand.ManagerId),
                    ErrorMessage = "This user is already a manager of another department"
                });
            }

            var user = await _userRepository.GetByIdAsync(command.ManagerId.Value, cancellationToken);
            if (user == null)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(CreateDepartmentCommand.ManagerId),
                    ErrorMessage = "User not found"
                });
            }
            else if (!user.IsApproved)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(CreateDepartmentCommand.ManagerId),
                    ErrorMessage = "User must be approved to be assigned as manager"
                });
            }
            else if (user.Role != Role.User)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(CreateDepartmentCommand.ManagerId),
                    ErrorMessage = "Only employees (role User) can be assigned as manager"
                });
            }

            if (errors.Any())
            {
                throw new CustomValidationException(errors);
            }

            user.Role = Role.Manager;
            await _userRepository.UpdateAsync(user, cancellationToken);
        }

        var department = new Department
        {
            DepartmentName = command.DepartmentName,
            ManagerId = command.ManagerId,
            NumberOfPeople = command.NumberOfPeople,
            CreatedDate = DateTime.UtcNow,
            IsActive = true
        };

        await _departmentRepository.AddAsync(department, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return department.Id;
    }
}

