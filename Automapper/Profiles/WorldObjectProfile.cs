using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Automapper.Profiles;

public class WorldObjectProfile : Profile
{
    public WorldObjectProfile()
    {
        CreateMap<WorldObjectEntity, WorldObject>()
            ;
        CreateMap<WorldObjectCreate, WorldObjectEntity>()
        ;
        CreateMap<WorldObjectUpdate, WorldObjectEntity>();
    }
}
