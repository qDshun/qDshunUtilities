namespace qDshunUtilities.EF.Entities
{
    public class TemplateEntity : BaseEntity
    {
        public string HTMLTemplate { get; set; }
        public List<WorldObjectEntity> WorldObjects { get; set; } = [];
    }
}
