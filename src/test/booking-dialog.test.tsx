import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import BookingDialog from "@/components/BookingDialog";

it("opens the demo and calculates the price from arrival and departure", () => {
  render(<BookingDialog property={{ title: "Logement de test", price: 500, weekendPrice: 700, guests: 4 }} />);
  fireEvent.click(screen.getByRole("button", { name: "Essayer la réservation" }));

  expect(screen.getByRole("dialog")).toHaveAccessibleName("Logement de test");
  fireEvent.change(screen.getByLabelText("Arrivée"), { target: { value: "2099-11-20" } });
  fireEvent.change(screen.getByLabelText("Départ"), { target: { value: "2099-11-23" } });

  const total = new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(1900);
  expect(screen.getByRole("status")).toHaveTextContent(`3 nuits · ${total.replace(/\s/g, " ")}`);
  for (const side of ["recto", "verso"]) {
    const trigger = screen.getByRole("button", { name: `Ajouter le ${side}` });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: `Prendre une photo du ${side}` })).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: `Prendre une photo du ${side}` })).toBeEnabled();
    expect(screen.getByRole("button", { name: `Choisir un fichier pour le ${side}` })).toBeEnabled();
  }
});
