"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCog, UserX, Shield } from "lucide-react";

const users = [
  { id: "USR-001", name: "Alex Johnson", email: "alex@example.com", role: "User", status: "Active", joined: "2026-01-15" },
  { id: "USR-002", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Super Admin", status: "Active", joined: "2025-11-20" },
  { id: "USR-003", name: "Michael Doe", email: "m.doe@example.com", role: "Support", status: "Active", joined: "2026-02-03" },
  { id: "USR-004", name: "Priya Sharma", email: "priya@example.com", role: "Analyst", status: "Active", joined: "2026-04-12" },
  { id: "USR-005", name: "David Kim", email: "david.k@example.com", role: "User", status: "Suspended", joined: "2026-05-30" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-zinc-500">Manage user accounts and configure Role-Based Access Control (RBAC).</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Shield className="w-4 h-4 mr-2" />
          Invite Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users registered on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={
                      user.role === "Super Admin" ? "destructive" :
                      user.role === "Support" ? "default" :
                      user.role === "Analyst" ? "secondary" : "outline"
                    }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "outline" : "destructive"} 
                           className={user.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500">{user.joined}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon"><UserCog className="w-4 h-4 text-zinc-500" /></Button>
                    <Button variant="ghost" size="icon"><UserX className="w-4 h-4 text-red-500" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4 text-zinc-500" /></Button>
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
