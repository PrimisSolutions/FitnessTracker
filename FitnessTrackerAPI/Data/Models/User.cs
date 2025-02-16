using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTrackerAPI.Data.Models
{
	public class User
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public required string Username { get; set; }
		public required string PasswordHash { get; set; }
		[Required]
		[EmailAddress]
		public required string Email { get; set; }
		public DateTime DateOfBirth { get; set; }
		[Range(0, 300)]
		public double Height { get; set; }
		[Range(0, 300)]
		public double Weight { get; set; }
	}
}