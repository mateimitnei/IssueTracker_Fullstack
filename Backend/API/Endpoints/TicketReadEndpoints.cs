using Application.DTOs;
using Infrastructure.Services;

namespace IssueTracker.Endpoints;

public static class TicketReadEndpoints
{
    public static RouteGroupBuilder MapTicketReadEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", async (DbServices dbs) =>
        {
            List<TicketDto> tickets = await dbs.GetAllAsync();
            return Results.Ok(tickets);
        });

        group.MapGet("/{ticketKey}", async (string ticketKey, DbServices dbs) =>
        {
            TicketDto? ticket = await dbs.GetTicketAsync(ticketKey);

            if (ticket == null) {
                throw new KeyNotFoundException($"Ticket {ticketKey} could not be found.");
            }

            return Results.Ok(ticket);
        });

        group.MapGet("/{ticketKey}/audit", async (string ticketKey, DbServices dbs) =>
        {
            List<TicketAuditDto> audits = await dbs.GetAuditAsync(ticketKey);
            return Results.Ok(audits);
        });
        
        // Bonus
        group.MapGet("/stats/mixed", async (DbServices dbs) =>
        {
            var stats = await dbs.GetTicketMixedStatsAsync();
            return Results.Ok(stats);
        });

        group.MapGet("/stats/status", async (DbServices dbs) =>
        {
            var statusCounts = await dbs.GetTicketStatusCountsAsync();
            return Results.Ok(statusCounts);
        });
 
        return group;
    }
}