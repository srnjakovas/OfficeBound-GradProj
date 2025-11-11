using FluentValidation;

namespace OfficeBound.Application.Commands.Departments.UpdateDepartment;

public class UpdateDepartmentCommandValidator : AbstractValidator<UpdateDepartmentCommand>
{
    public UpdateDepartmentCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id cannot be empty");
        
        RuleFor(x => x.DepartmentName)
            .NotEmpty()
            .WithMessage("Department Name cannot be empty")
            .MaximumLength(100)
            .WithMessage("Department Name cannot be longer than 100 characters");

        RuleFor(x => x.NumberOfPeople)
            .GreaterThan(0)
            .WithMessage("Number of People must be greater than 0");
    }
}

