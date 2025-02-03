using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessTrackerAPI.Data;
using FitnessTrackerAPI.Data.Models;

namespace FitnessTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutController : ControllerBase 
{
    private readonly ApplicationDbContext _context;

    public WorkoutController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetWorkouts()
    {
        var workouts = await _context.Workouts.ToListAsync();
        return Ok(workouts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorkout(int id)
    {
        var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id);
        if (workout == null)
        {
            return NotFound();
        }
        return Ok(workout);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkout([FromBody] Workout workout)
    {
        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
    }
}