using Microsoft.EntityFrameworkCore;
using FitnessTrackerAPI.Data.Models;

namespace FitnessTrackerAPI.Data;
public class ApplicationDbContext : DbContext
{
	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
	{
	}

	public DbSet<Workout> Workouts { get; set; }
	public DbSet<User> Users { get; set; }
}