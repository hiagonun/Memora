import { addDays, parseISO, format } from "date-fns";

export async function createGoogleCalendarEvent(
  providerToken: string,
  event: {
    summary: string;
    description: string;
    startDate: string; // YYYY-MM-DD
    startTime?: string; // HH:MM
  }
) {
  const url = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
  
  let start, end;

  if (event.startTime) {
    // Constrói a datetime com o offset do fuso local para evitar interpretação UTC.
    // Ex: "2024-04-13T20:00:00-03:00" em vez de "2024-04-13T20:00:00Z"
    const localOffset = (() => {
      const d = new Date();
      const offsetMin = -d.getTimezoneOffset(); // getTimezoneOffset retorna o inverso
      const sign = offsetMin >= 0 ? "+" : "-";
      const abs = Math.abs(offsetMin);
      const hh = String(Math.floor(abs / 60)).padStart(2, "0");
      const mm = String(abs % 60).padStart(2, "0");
      return `${sign}${hh}:${mm}`;
    })();

    const startISO = `${event.startDate}T${event.startTime}:00${localOffset}`;
    const dStart = new Date(startISO);
    const dEnd = new Date(dStart.getTime() + 60 * 60 * 1000); // 1 hora de duração

    start = { dateTime: startISO };
    end = { dateTime: dEnd.toISOString() };
  } else {
    // Eventos de dia inteiro no Google exigem que a data 'end' seja o dia seguinte ao início
    const dStart = parseISO(event.startDate);
    const dEnd = addDays(dStart, 1);
    const endString = format(dEnd, "yyyy-MM-dd");

    start = { date: event.startDate };
    end = { date: endString };
  }

  const body = {
    summary: event.summary,
    description: event.description,
    start,
    end,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: event.startTime ? 30 : 60 * 9 }, 
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

export async function updateGoogleCalendarEvent(
  providerToken: string,
  eventId: string,
  payload: {
    summary: string;
    description: string;
  }
) {
  const encodedId = encodeURIComponent(eventId);
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodedId}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${providerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: payload.summary,
      description: payload.description,
    }),
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
    throw new Error(message || "Falha ao atualizar evento no Google Calendar");
  }

  return response.json();
}
