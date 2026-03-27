import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpenseUseCase } from "../src/use-cases/expenses.usecase.js";
import { expectSuccess, expectError } from "../src/test-helpers.js";

describe("ExpenseUseCase.create", () => {
  let repository: any;
  let useCase: ExpenseUseCase;

  beforeEach(() => {
    repository = {
      save: vi.fn(),
      findAll: vi.fn(),
    };

    useCase = new ExpenseUseCase(repository);
  });

  it("should insert a valid expense", async () => {
    repository.save.mockResolvedValue({ success: true });

    const result = await useCase.create({
      amount: 100,
      description: "Lunch",
      category: "food",
      date: "2026-03-23",
    });

    expectSuccess(result);
    expect(repository.save).toHaveBeenCalledWith({
      amount: 100,
      description: "Lunch",
      category: "food",
      date: "2026-03-23",
    });
  });

  it("should reject invalid category", async () => {
    const result = await useCase.create({
      amount: 100,
      description: "Invalid",
      category: "transport", // assuming invalid
    });

    expectError(result);
    expect(result.error).toBe("VALIDATION_ERROR");
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("should use today's date if not provided", async () => {
    repository.save.mockResolvedValue({ success: true });

    const today = new Date().toISOString().slice(0, 10);

    const result = await useCase.create({
      amount: 50,
      description: "Groceries",
      category: "supermarket",
    });

    expectSuccess(result);

    expect(repository.save).toHaveBeenCalledWith({
      amount: 50,
      description: "Groceries",
      category: "supermarket",
      date: today,
    });
  });

  it("should reject negative amount", async () => {
    const result = await useCase.create({
      amount: -30,
      description: "Refund",
      category: "other",
    });

    expectError(result);
    expect(result.error).toBe("VALIDATION_ERROR");
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("should reject zero amount", async () => {
    const result = await useCase.create({
      amount: 0,
      description: "Invalid",
      category: "food",
    });

    expectError(result);
    expect(result.error).toBe("VALIDATION_ERROR");
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("should return DATABASE_ERROR if repository fails", async () => {
    repository.save.mockResolvedValue({ success: false });

    const result = await useCase.create({
      amount: 100,
      description: "Lunch",
      category: "food",
    });

    expectError(result);
    expect(result.error).toBe("DATABASE_ERROR");
  });
});