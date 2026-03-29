export type ServiceDto = {
  id: number;
  code: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
};

export type BranchDto = {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
};

export type BookAppointmentResponse = {
  id: number;
  message: string;
  branchName: string;
  serviceName: string;
  date: string;
  time: string;
};

type ErrorBody = { message?: string };

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ErrorBody;
    if (body?.message) return body.message;
  } catch {
    /* ignore */
  }
  return res.statusText || "Request failed";
}

export async function fetchServices(): Promise<ServiceDto[]> {
  const res = await fetch("/api/services");
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json() as Promise<ServiceDto[]>;
}

export async function fetchBranches(serviceId: number): Promise<BranchDto[]> {
  const res = await fetch(`/api/branches?serviceId=${encodeURIComponent(serviceId)}`);
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json() as Promise<BranchDto[]>;
}

export async function fetchAvailableTimeSlots(
  branchId: number,
  serviceId: number,
  dateIso: string
): Promise<string[]> {
  const params = new URLSearchParams({
    branchId: String(branchId),
    serviceId: String(serviceId),
    date: dateIso,
  });
  const res = await fetch(`/api/appointments/available-times?${params}`);
  if (!res.ok) throw new Error(await readErrorMessage(res));
  const data = (await res.json()) as { slots: string[] };
  return data.slots;
}

export async function bookAppointment(payload: {
  branchId: number;
  serviceId: number;
  date: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}): Promise<BookAppointmentResponse> {
  const res = await fetch("/api/appointments/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      branchId: payload.branchId,
      serviceId: payload.serviceId,
      date: payload.date,
      timeSlot: payload.timeSlot,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      notes: payload.notes || "",
    }),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json() as Promise<BookAppointmentResponse>;
}

export async function cancelAppointment(appointmentId: number): Promise<void> {
  const res = await fetch(`/api/appointments/${appointmentId}/cancel`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));
}

export function formatLocalDateIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
