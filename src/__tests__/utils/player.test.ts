import { Euler, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { createMoveData } from "@/utils/player";

describe("createMoveData", () => {
  it("creates correct position from Vector3", () => {
    const position = new Vector3(1, 2, 3);
    const rotation = new Euler(0, 0, 0);

    const result = createMoveData(position, rotation, false, "idle");

    expect(result.position).toEqual({ x: 1, y: 2, z: 3 });
  });

  it("creates rotation with z always 0", () => {
    const position = new Vector3(0, 0, 0);
    const rotation = new Euler(0.5, 1.0, 1.5);

    const result = createMoveData(position, rotation, false, "idle");

    expect(result.rotation?.x).toBe(0.5);
    expect(result.rotation?.y).toBe(1.0);
    expect(result.rotation?.z).toBe(0);
  });

  it("sets isRunning correctly", () => {
    const position = new Vector3(0, 0, 0);
    const rotation = new Euler(0, 0, 0);

    const running = createMoveData(position, rotation, true, "idle");
    const notRunning = createMoveData(position, rotation, false, "idle");

    expect(running.isRunning).toBe(true);
    expect(notRunning.isRunning).toBe(false);
  });

  it("sets animation string correctly", () => {
    const position = new Vector3(0, 0, 0);
    const rotation = new Euler(0, 0, 0);

    const idle = createMoveData(position, rotation, false, "idle");
    const walk = createMoveData(position, rotation, false, "walk");
    const run = createMoveData(position, rotation, true, "run");

    expect(idle.animation).toBe("idle");
    expect(walk.animation).toBe("walk");
    expect(run.animation).toBe("run");
  });

  it("handles negative position values", () => {
    const position = new Vector3(-10, -20, -30);
    const rotation = new Euler(0, 0, 0);

    const result = createMoveData(position, rotation, false, "idle");

    expect(result.position).toEqual({ x: -10, y: -20, z: -30 });
  });

  it("handles negative rotation values", () => {
    const position = new Vector3(0, 0, 0);
    const rotation = new Euler(-0.5, -1.0, -1.5);

    const result = createMoveData(position, rotation, false, "idle");

    expect(result.rotation?.x).toBe(-0.5);
    expect(result.rotation?.y).toBe(-1.0);
    expect(result.rotation?.z).toBe(0);
  });
});
