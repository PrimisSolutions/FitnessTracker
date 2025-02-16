using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using FitnessTrackerAPI.Controllers;
using FitnessTrackerAPI.Data;
using FitnessTrackerAPI.Data.Models;

namespace FitnessTrackerAPI.Tests.Controllers
{
	public class WorkoutControllerTests
	{
		private readonly DbContextOptions<ApplicationDbContext> _options;
		private readonly Mock<ILogger<WorkoutController>> _mockLogger;

		public WorkoutControllerTests()
		{
			_options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(databaseName: "TestDb")
				.Options;
			_mockLogger = new Mock<ILogger<WorkoutController>>();
		}

		[Fact]
		public async Task GetWorkouts_ReturnsOkResult()
		{
			// Arrange
			using var context = new ApplicationDbContext(_options);
			var controller = new WorkoutController(context, _mockLogger.Object);

			// Act
			var result = await controller.GetWorkouts();

			// Assert
			Assert.IsType<OkObjectResult>(result);
		}

		[Fact]
		public async Task CreateWorkout_ReturnsCreatedResult()
		{
			// Arrange
			using var context = new ApplicationDbContext(_options);
			var controller = new WorkoutController(context, _mockLogger.Object);
			var workout = new Workout
			{
				Name = "Test Workout",
				Type = "Test Type",
				Date = DateTime.Now,
				Duration = 60
			};

			// Act
			var result = await controller.CreateWorkout(workout);

			// Assert
			var createdResult = Assert.IsType<CreatedAtActionResult>(result);
			var returnedWorkout = Assert.IsType<Workout>(createdResult.Value);
			Assert.Equal(workout.Name, returnedWorkout.Name);
			Assert.Equal(workout.Type, returnedWorkout.Type);
		}

		[Fact]
		public async Task RemoveWorkout_ReturnsNoContentResult()
		{
			// Arrange
			using var context = new ApplicationDbContext(_options);
			var controller = new WorkoutController(context, _mockLogger.Object);
			var workout = new Workout
			{
				Name = "Test Workout",
				Type = "Test Type",
				Date = DateTime.Now,
				Duration = 60
			};
			await controller.CreateWorkout(workout);

			// Get workout ID
			var postedWorkout = await context.Workouts.FirstOrDefaultAsync(w => w.Name == "Test Workout");
			Assert.NotNull(postedWorkout);
			
			var workoutId = postedWorkout.Id;

			// Act
			var result = await controller.DeleteWorkout(workoutId);

			// Assert
			Assert.IsType<NoContentResult>(result);
		}
	}
}