using Microsoft.EntityFrameworkCore;
using FitnessTrackerAPI.Data;

namespace FitnessTrackerAPI.Tests.Helpers
{
	public static class TestDbContextHelper
	{
		public static ApplicationDbContext CreateTestContext()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
				.Options;

			return new ApplicationDbContext(options);
		}
	}
}