using AutoMapper;
using qDshunUtilities.Controllers.LootItem.Inbound;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Helpers;
using qDshunUtilities.Models.Loot;
using qDshunUtilities.Models.LootItem;

namespace qDshunUtilities.Automapper.Profiles;

public class LootItemProfile : Profile
{
    public LootItemProfile()
    {


        CreateMap<LootItemEntity, MaterializedLootItemModel>()
            .ForMember(dest => dest.Count, opt => opt.MapFrom(src => DiceExpressionEvaluator.EvaluateDiceExpression(src.CountExpression)))
            ;

        CreateMap<LootItemEntity, LootItemModel>()
            ;

        CreateMap<LootItemCreateRequest, LootItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootSource, opt => opt.Ignore())
            .ForMember(dest => dest.LootSourceId, opt => opt.Ignore())
            ;

        CreateMap<LootItemUpdateRequest, LootItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootSource, opt => opt.Ignore())
            .ForMember(dest => dest.LootSourceId, opt => opt.Ignore())
            ;
    }
}
