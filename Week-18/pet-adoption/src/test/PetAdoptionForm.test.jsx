import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import PetAdoptionForm from "../../solution/components/PetAdoptionForm";

beforeEach(() => {
  cleanup();
  // Mock window.alert
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

describe("PetAdoptionForm Component", () => {
  it("renders form inputs and submit button", () => {
    render(<PetAdoptionForm />);
    expect(screen.getByPlaceholderText("Pet Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("validates required fields and prevents submission if empty", async () => {
    render(<PetAdoptionForm />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    
    await userEvent.click(submitButton);
    
    // Check if alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith("Please fill out all fields");
  });

  it("allows users to fill out the form and submit", async () => {
    render(<PetAdoptionForm />);
    const petNameInput = screen.getByPlaceholderText("Pet Name");
    const adopterNameInput = screen.getByPlaceholderText("Your Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(petNameInput, "Buddy");
    await userEvent.type(adopterNameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(phoneInput, "1234567890");
    await userEvent.click(submitButton);

    expect(window.alert).not.toHaveBeenCalled();
  });

  it("renders the adopter data table after form submission", async () => {
    render(<PetAdoptionForm />);
    const petNameInput = screen.getByPlaceholderText("Pet Name");
    const adopterNameInput = screen.getByPlaceholderText("Your Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(petNameInput, "Buddy");
    await userEvent.type(adopterNameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(phoneInput, "1234567890");
    await userEvent.click(submitButton);

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
