using MediatR;
using OfficeBound.Domain.Entities;
using OfficeBound.Infrastructure;

namespace OfficeBound.Application.Commands.Requests.CreateRequest;

public class CreateRequestCommandHandler : IRequestHandler<CreateRequestCommand, int>
{
    private readonly OfficeBoundDbContext _officeBoundDbContext;
    
    public CreateRequestCommandHandler(OfficeBoundDbContext  officeBoundDbContext)
    {
        _officeBoundDbContext = officeBoundDbContext;
    }
    
    public async Task<int> Handle(CreateRequestCommand requestCommand, CancellationToken cancellationToken)
    {
        var request = new Request
        {
            Description = requestCommand.Description,
            RequestType = requestCommand.RequestType,
            CreatedDate = DateTime.Now.ToUniversalTime()
        };

        await _officeBoundDbContext.Requests.AddAsync(request, cancellationToken);
        await _officeBoundDbContext.SaveChangesAsync(cancellationToken);

        return request.Id;
    }
}