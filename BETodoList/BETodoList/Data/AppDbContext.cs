using BETodoList.Models;
using Microsoft.EntityFrameworkCore;

namespace BETodoList.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<SubtaskItem> Subtasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id).HasColumnName("id");
                entity.Property(u => u.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                entity.Property(u => u.Email).HasColumnName("email").HasMaxLength(150).IsRequired();
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
                entity.Property(u => u.CreatedAt).HasColumnName("created_at");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).HasColumnName("id");
                entity.Property(c => c.UserId).HasColumnName("user_id");
                entity.Property(c => c.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                entity.Property(c => c.Color).HasColumnName("color").HasMaxLength(7);
                entity.Property(c => c.CreatedAt).HasColumnName("created_at");
                entity.HasOne(c => c.User).WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.ToTable("tasks");
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id).HasColumnName("id");
                entity.Property(t => t.UserId).HasColumnName("user_id");
                entity.Property(t => t.CategoryId).HasColumnName("category_id");
                entity.Property(t => t.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
                entity.Property(t => t.Description).HasColumnName("description");
                entity.Property(t => t.Priority).HasColumnName("priority").HasMaxLength(20);
                entity.Property(t => t.Status).HasColumnName("status").HasMaxLength(20);
                entity.Property(t => t.DueDate).HasColumnName("due_date");
                entity.Property(t => t.CreatedAt).HasColumnName("created_at");
                entity.Property(t => t.UpdatedAt).HasColumnName("updated_at");
                entity.HasOne(t => t.User).WithMany().HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(t => t.Category).WithMany().HasForeignKey(t => t.CategoryId).OnDelete(DeleteBehavior.SetNull);
                entity.HasMany(t => t.Subtasks).WithOne(s => s.Task).HasForeignKey(s => s.TaskId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<SubtaskItem>(entity =>
            {
                entity.ToTable("subtasks");
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id).HasColumnName("id");
                entity.Property(s => s.TaskId).HasColumnName("task_id");
                entity.Property(s => s.Label).HasColumnName("label").HasMaxLength(255).IsRequired();
                entity.Property(s => s.IsDone).HasColumnName("is_done");
                entity.Property(s => s.CreatedAt).HasColumnName("created_at");
            });
        }
    }
}
