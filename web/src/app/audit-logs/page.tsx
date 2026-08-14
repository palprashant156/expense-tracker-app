"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const auditLogs = [
  { id: "LOG-9281", timestamp: "2026-08-14 14:22:05", action: "AI_GENERATION", user: "USR-001", details: "Health score query processed successfully", status: "Success" },
  { id: "LOG-9280", timestamp: "2026-08-14 14:18:30", action: "AI_VALIDATION_FAILED", user: "USR-001", details: "Hallucination blocked: Attempted to inject invalid balance.", status: "Warning" },
  { id: "LOG-9279", timestamp: "2026-08-14 13:45:11", action: "BALANCE_RECONCILE", user: "SYSTEM", details: "Reconciliation drift detected and fixed (+450.00 INR)", status: "Warning" },
  { id: "LOG-9278", timestamp: "2026-08-14 12:10:00", action: "ADMIN_LOGIN", user: "Sarah Chen", details: "Super Admin authentication successful", status: "Success" },
  { id: "LOG-9277", timestamp: "2026-08-14 11:05:44", action: "API_RATE_LIMIT", user: "USR-089", details: "Excessive requests to /transactions endpoint", status: "Error" },
];

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit & AI Monitoring Logs</h1>
        <p className="text-zinc-500">Monitor system events, AI determinism blocks, and security audits.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Logs</CardTitle>
          <CardDescription>Real-time stream of backend and AI engine events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Event Action</TableHead>
                <TableHead>User / Source</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-zinc-500 whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell className="text-sm text-zinc-600">{log.details}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={
                      log.status === "Success" ? "outline" :
                      log.status === "Warning" ? "secondary" : "destructive"
                    } className={
                      log.status === "Success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      log.status === "Warning" ? "bg-amber-50 text-amber-700 border-amber-200" : ""
                    }>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
