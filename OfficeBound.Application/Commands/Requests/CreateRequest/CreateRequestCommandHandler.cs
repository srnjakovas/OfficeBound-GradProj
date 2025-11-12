using MediatR;
using Microsoft.Extensions.Options;
using OfficeBound.Application.Configuration;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Requests.CreateRequest;

public class CreateRequestCommandHandler : IRequestHandler<CreateRequestCommand, int>
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly OfficeResourcesConfiguration _officeResources;
    
    public CreateRequestCommandHandler(
        IRequestRepository requestRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IOptions<OfficeResourcesConfiguration> officeResources)
    {
        _requestRepository = requestRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _officeResources = officeResources.Value;
    }
    
    public async Task<int> Handle(CreateRequestCommand requestCommand, CancellationToken cancellationToken)
    {
        if (!requestCommand.UserId.HasValue)
        {
            throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
            {
                new() { Property = nameof(CreateRequestCommand.RequestType), ErrorMessage = "User information is required" }
            });
        }

        var user = await _userRepository.GetByIdAsync(requestCommand.UserId.Value, cancellationToken);
        if (user == null)
        {
            throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
            {
                new() { Property = nameof(CreateRequestCommand.RequestType), ErrorMessage = "User not found" }
            });
        }

        if (requestCommand.RequestType == RequestType.Desk || requestCommand.RequestType == RequestType.DeskWithParking)
        {
            if (user.Role == Role.BranchManager)
            {
                throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
                {
                    new() { Property = nameof(CreateRequestCommand.RequestType), ErrorMessage = "Branch Managers cannot request desks as they have their own office" }
                });
            }
        }

        if (requestCommand.RequestType == RequestType.ConferenceRoom || requestCommand.RequestType == RequestType.ConferenceRoomWithParking)
        {
            if (user.Role != Role.Manager && user.Role != Role.BranchManager && user.Role != Role.Administrator)
            {
                throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
                {
                    new() { Property = nameof(CreateRequestCommand.RequestType), ErrorMessage = "Only Managers, Branch Managers, and Administrators can request Conference Rooms" }
                });
            }
        }

        var defaultRequestDate = DateTime.Today.AddDays(1).ToUniversalTime();
        var requestDate = requestCommand.RequestDate?.ToUniversalTime() ?? defaultRequestDate;
        
        await ValidateAvailabilityAsync(requestCommand.RequestType, requestDate, null, cancellationToken);
        
        var request = new Request
        {
            Description = requestCommand.Description,
            RequestType = requestCommand.RequestType,
            RequestDate = requestDate,
            CreatedDate = DateTime.UtcNow,
            RequestStatus = RequestStatus.Pending,
            DepartmentId = requestCommand.DepartmentId
        };

        // Ensure the user is tracked by the context
        request.Users.Add(user);

        await _requestRepository.AddAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return request.Id;
    }

    private async Task ValidateAvailabilityAsync(
        RequestType requestType, 
        DateTime requestDate, 
        int? excludeRequestId, 
        CancellationToken cancellationToken)
    {
        var errors = new List<Contracts.Errors.ValidationError>();

        switch (requestType)
        {
            case RequestType.Desk:
                var deskCount = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.Desk, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.Desk, requestDate, cancellationToken);
                
                var deskWithParkingCount = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.DeskWithParking, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.DeskWithParking, requestDate, cancellationToken);
                
                var totalDesksUsed = deskCount + deskWithParkingCount;
                if (totalDesksUsed >= _officeResources.NumberOfDesks)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(CreateRequestCommand.RequestType),
                        ErrorMessage = $"No desks available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfDesks - totalDesksUsed}, Required: 1"
                    });
                }
                break;

            case RequestType.DeskWithParking:
                var deskCount2 = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.Desk, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.Desk, requestDate, cancellationToken);
                
                var deskWithParkingCount2 = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.DeskWithParking, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.DeskWithParking, requestDate, cancellationToken);
                
                var totalDesksUsed2 = deskCount2 + deskWithParkingCount2;
                if (totalDesksUsed2 >= _officeResources.NumberOfDesks)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(CreateRequestCommand.RequestType),
                        ErrorMessage = $"No desks available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfDesks - totalDesksUsed2}, Required: 1"
                    });
                }

                var conferenceRoomWithParkingCount2 = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.ConferenceRoomWithParking, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.ConferenceRoomWithParking, requestDate, cancellationToken);
                
                var totalParkingUsed2 = deskWithParkingCount2 + conferenceRoomWithParkingCount2;
                if (totalParkingUsed2 >= _officeResources.NumberOfParkingSpaces)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(CreateRequestCommand.RequestType),
                        ErrorMessage = $"No parking spaces available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfParkingSpaces - totalParkingUsed2}, Required: 1"
                    });
                }
                break;

            case RequestType.ConferenceRoom:
                var conferenceRoomCount = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.ConferenceRoom, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.ConferenceRoom, requestDate, cancellationToken);
                
                var conferenceRoomWithParkingCount = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.ConferenceRoomWithParking, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.ConferenceRoomWithParking, requestDate, cancellationToken);
                
                var totalConferenceRoomsUsed = conferenceRoomCount + conferenceRoomWithParkingCount;
                if (totalConferenceRoomsUsed >= _officeResources.NumberOfConferenceRooms)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(CreateRequestCommand.RequestType),
                        ErrorMessage = $"No conference rooms available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfConferenceRooms - totalConferenceRoomsUsed}, Required: 1"
                    });
                }
                break;

            case RequestType.ConferenceRoomWithParking:
                var conferenceRoomCount3 = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.ConferenceRoom, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.ConferenceRoom, requestDate, cancellationToken);
                
                var conferenceRoomWithParkingCount3 = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.ConferenceRoomWithParking, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.ConferenceRoomWithParking, requestDate, cancellationToken);
                
                var totalConferenceRoomsUsed3 = conferenceRoomCount3 + conferenceRoomWithParkingCount3;
                if (totalConferenceRoomsUsed3 >= _officeResources.NumberOfConferenceRooms)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(CreateRequestCommand.RequestType),
                        ErrorMessage = $"No conference rooms available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfConferenceRooms - totalConferenceRoomsUsed3}, Required: 1"
                    });
                }

                var deskWithParkingCount3 = excludeRequestId.HasValue
                    ? await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                        RequestType.DeskWithParking, requestDate, excludeRequestId.Value, cancellationToken)
                    : await _requestRepository.CountByTypeAndDateAsync(
                        RequestType.DeskWithParking, requestDate, cancellationToken);
                
                var totalParkingUsed3 = deskWithParkingCount3 + conferenceRoomWithParkingCount3;
                if (totalParkingUsed3 >= _officeResources.NumberOfParkingSpaces)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(CreateRequestCommand.RequestType),
                        ErrorMessage = $"No parking spaces available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfParkingSpaces - totalParkingUsed3}, Required: 1"
                    });
                }
                break;
        }

        if (errors.Any())
        {
            throw new CustomValidationException(errors);
        }
    }
}