// app/api/holidays/stats/route.ts
import { demoHolidayRequests, demoHolidayTypes } from "@/data/temp";
import { NextResponse } from "next/server";

export async function GET() {
  const totalRequests = demoHolidayRequests.length;

  const pendingRequests = demoHolidayRequests.filter(
    (r) => r.status === "PENDING_MANAGER" || r.status === "PENDING_HR"
  ).length;

  const acceptedRequests = demoHolidayRequests.filter(
    (r) => r.status === "ACCEPTED"
  ).length;

  const rejectedRequests = demoHolidayRequests.filter(
    (r) => r.status === "REJECTED"
  ).length;

  const byType = demoHolidayTypes.map((type) => {
    const requestsOfType = demoHolidayRequests.filter(
      (r) => r.typeId === type.id
    );

    return {
      typeId: type.id,
      label: type.label,
      code: type.code,
      count: requestsOfType.length,
      pending: requestsOfType.filter(
        (r) => r.status === "PENDING_MANAGER" || r.status === "PENDING_HR"
      ).length,
      accepted: requestsOfType.filter((r) => r.status === "ACCEPTED").length,
      rejected: requestsOfType.filter((r) => r.status === "REJECTED").length,
    };
  });

  return NextResponse.json({
    success: true,
    totalRequests,
    pendingRequests,
    acceptedRequests,
    rejectedRequests,
    byType,
  });
}
