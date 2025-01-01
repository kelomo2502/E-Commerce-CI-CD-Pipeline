import { render, screen, waitFor } from "@testing-library/react";
import Home from "../Home";
import axios from "axios";

// Mock axios
jest.mock("axios");

beforeEach(() => {
  jest.resetAllMocks(); // Ensure mocks are reset before each test
});

describe("Home Component", () => {
  it("fetches and displays home and services data", async () => {
    // Simulating successful API responses
    axios.get.mockResolvedValueOnce({ data: { message: "Welcome home" } });
    axios.get.mockResolvedValueOnce({ data: { message: "We offer good services" } });

    render(<Home />);

    // Verify the rendered data
    await waitFor(() => {
      expect(screen.getByText("Welcome home")).toBeInTheDocument();
      expect(screen.getByText("We offer good services")).toBeInTheDocument();
    });
  });
});
