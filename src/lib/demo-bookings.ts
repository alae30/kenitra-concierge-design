export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type DemoBooking = {
  id: string;
  property: string;
  guest: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email: string;
  arrival: string;
  departure: string;
  guests: number;
  amount: number;
  status: BookingStatus;
  createdAt: string;
  contract?: Blob;
};

export const bookingsChanged = "center-warm-stay-demo-bookings";

async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("center-warm-stay-demo", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("bookings", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction("bookings", mode);
      const request = work(transaction.objectStore("bookings"));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}

export function listDemoBookings() {
  return run("readonly", (store) => store.getAll() as IDBRequest<DemoBooking[]>);
}

export async function saveDemoBooking(booking: DemoBooking) {
  await run("readwrite", (store) => store.put(booking));
  // The notification contains no booking details.
  try { localStorage.setItem(bookingsChanged, crypto.randomUUID()); } catch { /* Storage may be disabled. */ }
}

export function downloadDemoContract(booking: DemoBooking) {
  if (!booking.contract) return;
  const url = URL.createObjectURL(booking.contract);
  const link = document.createElement("a");
  link.href = url;
  link.download = `contrat-${booking.id.slice(0, 8)}.pdf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
