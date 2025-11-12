using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Departments.UpdateDepartment;

public class UpdateDepartmentCommandHandler : IRequestHandler<UpdateDepartmentCommand, Unit>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateDepartmentCommandHandler(
        IDepartmentRepository departmentRepository, 
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _departmentRepository = departmentRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<Unit> Handle(UpdateDepartmentCommand command, CancellationToken cancellationToken)
    {
        var department = await _departmentRepository.GetByIdWithManagerAsync(command.Id, cancellationToken);

        if (department is null)
        {
            throw new NotFoundException($"{nameof(Department)} with Id: {command.Id} was not found in Database");
        }

        var errors = new List<Contracts.Errors.ValidationError>();

        if (department.ManagerId.HasValue && department.ManagerId != command.ManagerId)
        {
            var oldManager = await _userRepository.GetByIdAsync(department.ManagerId.Value, cancellationToken);
            if (oldManager != null && oldManager.Role == Role.Manager)
            {
                var otherDepartment = await _departmentRepository.GetByManagerIdAsync(department.ManagerId.Value, cancellationToken);
                if (otherDepartment == null || otherDepartment.Id == command.Id)
                {
                    oldManager.Role = Role.User;
                    await _userRepository.UpdateAsync(oldManager, cancellationToken);
                }
            }
        }

        if (command.ManagerId.HasValue)
        {
            var existingDepartment = await _departmentRepository.GetByManagerIdAsync(command.ManagerId.Value, cancellationToken);
            if (existingDepartment != null && existingDepartment.Id != command.Id)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(UpdateDepartmentCommand.ManagerId),
                    ErrorMessage = "This user is already a manager of another department"
                });
            }

            var user = await _userRepository.GetByIdAsync(command.ManagerId.Value, cancellationToken);
            if (user == null)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(UpdateDepartmentCommand.ManagerId),
                    ErrorMessage = "User not found"
                });
            }
            else if (!user.IsApproved)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(UpdateDepartmentCommand.ManagerId),
                    ErrorMessage = "User must be approved to be assigned as manager"
                });
            }
            else if (user.Role != Role.User && user.Role != Role.Manager)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(UpdateDepartmentCommand.ManagerId),
                    ErrorMessage = "Only employees (role User) can be assigned as manager"
                });
            }

            if (errors.Any())
            {
                throw new CustomValidationException(errors);
            }

            if (user.Role != Role.Manager)
            {
                user.Role = Role.Manager;
                await _userRepository.UpdateAsync(user, cancellationToken);
            }
        }
        else
        {
        }

        // Only administrators can change department name
        if (command.DepartmentName != department.DepartmentName)
        {
            if (!command.UserId.HasValue)
            {
                errors.Add(new Contracts.Errors.ValidationError
                {
                    Property = nameof(UpdateDepartmentCommand.DepartmentName),
                    ErrorMessage = "User information is required to update department name"
                });
            }
            else
            {
                var requestingUser = await _userRepository.GetByIdAsync(command.UserId.Value, cancellationToken);
                if (requestingUser == null)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(UpdateDepartmentCommand.DepartmentName),
                        ErrorMessage = "User not found"
                    });
                }
                else if (requestingUser.Role != Role.Administrator)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(UpdateDepartmentCommand.DepartmentName),
                        ErrorMessage = "Only administrators can edit department name"
                    });
                }
            }

            if (errors.Any())
            {
                throw new CustomValidationException(errors);
            }
        }

        department.DepartmentName = command.DepartmentName;
        department.ManagerId = command.ManagerId;
        department.NumberOfPeople = command.NumberOfPeople;

        await _departmentRepository.UpdateAsync(department, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}

