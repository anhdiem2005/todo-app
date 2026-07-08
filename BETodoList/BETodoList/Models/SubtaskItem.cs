namespace BETodoList.Models
{
    public class SubtaskItem
    {
        public int Id { get; set; }
        public int? TaskId { get; set; }
        public string Label { get; set; } = string.Empty;
        public bool IsDone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public TaskItem? Task { get; set; }
    }
}
