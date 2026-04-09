import { addDays, parseISO, format } from "date-fns";

export async function createGoogleCalendarEvent(
  providerToken: string,
  event: {
    summary: string;
    description: string;
    startDate: string; // YYYY-MM-DD
  }
) {
  const url = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
  
  // Eventos de dia inteiro no Google exigem que a data 'end' seja o dia seguinte ao início
  const dStart = parseISO(event.startDate);
  const dEnd = addDays(dStart, 1);
  const endString = format(dEnd, "yyyy-MM-dd");

  const body = {
    summary: event.summary,
    description: event.description,
    start: {
      date: event.startDate,
    },
    end: {
      date: endString,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 60 * 9 }, // push notification 9h da manhã do proprio dia
      ],
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${providerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Google API Error: ${errorData.error?.message || "Desconhecido"}`);
  }

  return response.json();
}

export async function deleteGoogleCalendarEvent(providerToken: string, eventId: string) {
  const encodedId = encodeURIComponent(eventId);
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodedId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${providerToken}`,
    },
  });

  if (response.status === 404 || response.status === 410) {
    return;
  }

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try {
      const err = JSON.parse(text) as { error?: { message?: string } };
      message = err.error?.message ?? text;
    } catch {
      /* use raw text */
    }
    throw new Error(message || "Falha ao deletar no Google Calendar");
  }
}
