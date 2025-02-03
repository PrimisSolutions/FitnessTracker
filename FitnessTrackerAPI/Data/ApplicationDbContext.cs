using Microsoft.EntityFrameworkCore;
using FitnessTrackerAPI.Data.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Workout> Workouts { get; set; }
}