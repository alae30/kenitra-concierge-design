import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import BookingDialog from "@/components/BookingDialog";

it("opens the demo and calculates the price from arrival and departure", () => {
  render(<BookingDialog property={{ title: "Logement de test", price: 450, guests: 4 }} />);
  fireEvent.click(screen.getByRole("button", { name: "Essayer la réservation" }));

  expect(screen.getByRole("dialog")).toHaveAccessibleName("Logement de test");
  fireEvent.change(screen.getByLabelText("Arrivée"), { target: { value: "2099-11-23" } });
  fireEvent.change(screen.getByLabelText("Départ"), { target: { value: "2099-11-26" } });

  const total = new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(1350);
  expect(screen.getByRole("status")).toHaveTextContent(`3 nuit(s) · ${total.replace(/\s/g, " ")}`);
  expect(screen.getByLabelText("Recto")).toBeRequired();
  expect(screen.getByLabelText("Verso")).toBeRequired();
});
