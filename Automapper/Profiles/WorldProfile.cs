using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models;

namespace qDshunUtilities.Automapper.Profiles;

public class WorldProfile : Profile
{
    public WorldProfile()
    {
        CreateMap<WorldEntity, World>();

        CreateMap<WorldCreate, WorldEntity>();

        CreateMap<WorldUpdate, WorldEntity>();
    }
}
