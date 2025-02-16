using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessTrackerAPI.Data;
using FitnessTrackerAPI.Data.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace FitnessTrackerAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class WorkoutController : ControllerBase 
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<WorkoutController> _logger;

    public WorkoutController(ApplicationDbContext context, ILogger<WorkoutController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetWorkouts()
    {
        _logger.LogInformation("Getting all workouts");
        var workouts = await _context.Workouts.ToListAsync();
        return Ok(workouts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorkout(int id)
    {
        _logger.LogInformation("Getting workout with ID: {Id}", id);
        var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id);
        if (workout == null)
        {
            _logger.LogWarning("Workout with ID: {Id} not found", id);
            return NotFound();
        }
        return Ok(workout);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkout([FromBody] Workout workout)
    {
        _logger.LogInformation("Creating new workout");
        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Created workout with ID: {Id}", workout.Id);
        return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkout(int id, [FromBody] Workout workout)
    {
        _logger.LogInformation("Updating workout with ID: {Id}", id);
        if (id != workout.Id)
        {
            _logger.LogWarning("Update failed: ID mismatch. Path ID: {PathId}, Workout ID: {WorkoutId}", id, workout.Id);
            return BadRequest();
        }

        _context.Entry(workout).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Successfully updated workout with ID: {Id}", id);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Workouts.AnyAsync(w => w.Id == id))
            {
                _logger.LogWarning("Update failed: Workout with ID: {Id} not found", id);
                return NotFound();
            }
            _logger.LogError("Concurrency error while updating workout with ID: {Id}", id);
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout(int id)
    {
        _logger.LogInformation("Deleting workout with ID: {Id}", id);
        var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id);
        if (workout == null)
        {
            _logger.LogWarning("Delete failed: Workout with ID: {Id} not found", id);
            return NotFound();
        }

        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Successfully deleted workout with ID: {Id}", id);

        return NoContent();
    }
}