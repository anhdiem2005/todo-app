using BETodoList.Models;
using Microsoft.EntityFrameworkCore;

namespace BETodoList.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

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
        }
    }
}
