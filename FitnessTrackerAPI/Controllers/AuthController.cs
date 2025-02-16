using System.ComponentModel.DataAnnotations;
using FitnessTrackerAPI.Data;
using FitnessTrackerAPI.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace FitnessTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
	private readonly ApplicationDbContext _context;
	private readonly IConfiguration _configuration;
	private readonly ILogger<AuthController> _logger;

	public AuthController(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
	{
		_context = context;
		_configuration = configuration;
		_logger = logger;
	}

	[HttpPost("register")]
	public async Task<IActionResult> Register([FromBody] RegisterRequest request)
	{
		_logger.LogInformation("Registering user with email: {Email}", request.Email);

		try
		{
			var user = new User
			{
			Email = request.Email,
			PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
			Username = request.Email
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			_logger.LogInformation("User registered successfully with email: {Email}", request.Email);
			return Ok(new { Message = "User registered successfully" });
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error occurred while registering user with email: {Email}", request.Email);
			return StatusCode(500, "Internal server error");
		}
	}

	[HttpPost("login")]
	public async Task<IActionResult> Login([FromBody] LoginRequest request)
	{
		_logger.LogInformation("Logging in user with email: {Email}", request.Email);
		try
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
			if (user == null)
			{
				_logger.LogWarning("User not found for email: {Email}", request.Email);
				return Unauthorized(new { Message = "User not found" });
			}

			if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
			{
				_logger.LogWarning("Invalid password attempt for email: {Email}", request.Email);
				return Unauthorized(new { Message = "Invalid password" });
			}

			var token = GenerateJwtToken(user);
			_logger.LogInformation("User logged in successfully with email: {Email}", request.Email);
			return Ok(new { Token = token });
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error occurred while logging in user with email: {Email}", request.Email);
			return StatusCode(500, "Internal server error");
		}
	}

	private string GenerateJwtToken(User user)
	{
		var jwtKey = _configuration["Jwt:Key"] ?? 
			throw new InvalidOperationException("JWT Key is not configured");

		var credentials = new SigningCredentials(
			new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
			SecurityAlgorithms.HmacSha256
		);

		var token = new JwtSecurityToken(
			issuer: _configuration["Jwt:Issuer"],
			audience: _configuration["Jwt:Audience"],
			claims: new[] { new Claim(ClaimTypes.Email, user.Email) },
			expires: DateTime.Now.AddHours(1),
			signingCredentials: credentials
		);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}
}

public class RegisterRequest
{
	[Required]
	public required string Email { get; set; }

	[Required]
	public required string Password { get; set; }
}

public class LoginRequest {
	[Required]
	public required string Email { get; set; }

	[Required]
	public required string Password { get; set; }
}