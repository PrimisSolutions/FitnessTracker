using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTrackerAPI.Data.Models
{
	public class Workout
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public int UserId { get; set; } // Link to the user
		public required string Name { get; set; } // Name of the workout - user set
		public required string Type { get; set; } // Type of workout e.g. cardio, weights
		public double Duration { get; set; } // Minutes
		public double Calories { get; set; } // kcal
		public DateTime Date { get; set; } = DateTime.UtcNow;
	}
}