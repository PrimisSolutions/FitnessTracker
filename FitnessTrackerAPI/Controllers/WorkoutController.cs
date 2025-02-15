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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkout(int id, [FromBody] Workout workout)
    {
        if (id != workout.Id)
        {
            return BadRequest();
        }

        _context.Entry(workout).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Workouts.AnyAsync(w => w.Id == id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout(int id)
    {
        var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id);
        if (workout == null)
        {
            return NotFound();
        }

        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}