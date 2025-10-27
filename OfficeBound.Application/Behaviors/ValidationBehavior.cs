using FluentValidation;
using MediatR;
using OfficeBound.Contracts.Errors;
using OfficeBound.Contracts.Exceptions;

namespace OfficeBound.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }
    
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var context = new ValidationContext<TRequest>(request);

        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults.Where(v => !v.IsValid)
            .SelectMany(v => v.Errors)
            .Select(v => new ValidationError
            {
                Property = v.PropertyName,
                ErrorMessage = v.ErrorMessage
            }).ToList();

        if (failures.Count > 0)
        {
            throw new CustomValidationException(failures);
        }

        var response = await next();
        return response;
    }
}