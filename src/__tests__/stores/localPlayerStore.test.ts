import { Euler, Vector3 } from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LIVEKIT_CONFIG } from "@/constants/sync";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

describe("useLocalPlayerStore", () => {
  beforeEach(() => {
    useLocalPlayerStore.getState().reset();
  });

  describe("initial state", () => {
    it("has correct initial values", () => {
      const state = useLocalPlayerStore.getState();
      expect(state.sessionId).toBe("");
      expect(state.username).toBe("Anonymous");
      expect(state.position.x).toBe(0);
      expect(state.position.y).toBe(0);
      expect(state.position.z).toBe(0);
      expect(state.rotation.x).toBe(0);
      expect(state.rotation.y).toBe(0);
      expect(state.rotation.z).toBe(0);
      expect(state.isRunning).toBe(false);
      expect(state.animationState).toBe("idle");
      expect(state.isFPV).toBe(false);
      expect(state.pendingTeleport).toBeNull();
      expect(state.hasJoinedWorld).toBe(false);
      expect(state.roomName).toBe(LIVEKIT_CONFIG.defaultRoom);
    });
  });

  describe("basic setters", () => {
    it("sets sessionId", () => {
      useLocalPlayerStore.getState().setSessionId("test-session");
      expect(useLocalPlayerStore.getState().sessionId).toBe("test-session");
    });

    it("sets username", () => {
      useLocalPlayerStore.getState().setUsername("TestUser");
      expect(useLocalPlayerStore.getState().username).toBe("TestUser");
    });

    it("sets isRunning", () => {
      useLocalPlayerStore.getState().setIsRunning(true);
      expect(useLocalPlayerStore.getState().isRunning).toBe(true);
    });

    it("sets animation", () => {
      useLocalPlayerStore.getState().setAnimation("forward");
      expect(useLocalPlayerStore.getState().animationState).toBe("forward");
    });

    it("sets roomName", () => {
      useLocalPlayerStore.getState().setRoomName("test-room");
      expect(useLocalPlayerStore.getState().roomName).toBe("test-room");
    });
  });

  describe("position and rotation", () => {
    it("sets position with rounding", () => {
      useLocalPlayerStore
        .getState()
        .setPosition(new Vector3(1.23456, 2.34567, 3.45678));
      const { position } = useLocalPlayerStore.getState();
      expect(position.x).toBe(1.23);
      expect(position.y).toBe(2.35);
      expect(position.z).toBe(3.46);
    });

    it("does not update state if rounded position is same", () => {
      useLocalPlayerStore
        .getState()
        .setPosition(new Vector3(1.001, 2.002, 3.003));
      const state1 = useLocalPlayerStore.getState();

      useLocalPlayerStore
        .getState()
        .setPosition(new Vector3(1.002, 2.003, 3.004));
      const state2 = useLocalPlayerStore.getState();

      expect(state1.position).toBe(state2.position);
    });

    it("sets rotation with normalization", () => {
      useLocalPlayerStore.getState().setRotation(new Euler(0.5, 1.0, 1.5));
      const { rotation } = useLocalPlayerStore.getState();
      expect(rotation.x).toBeCloseTo(0.5, 1);
      expect(rotation.y).toBeCloseTo(1.0, 1);
    });
  });

  describe("sendMovement", () => {
    it("does nothing without publisher", () => {
      useLocalPlayerStore.getState().sendMovement();
      expect(useLocalPlayerStore.getState().lastSentTime).toBe(0);
    });

    it("calls publisher with correct data", () => {
      const publisher = vi.fn();
      useLocalPlayerStore.getState().setPosition(new Vector3(1, 2, 3));
      useLocalPlayerStore.getState().setRotation(new Euler(0.1, 0.2, 0.3));
      useLocalPlayerStore.getState().setIsRunning(true);
      useLocalPlayerStore.getState().setAnimation("forward");

      useLocalPlayerStore.getState().sendMovement(publisher);

      expect(publisher).toHaveBeenCalledOnce();
      const calledWith = publisher.mock.calls[0][0];
      expect(calledWith.position).toEqual({ x: 1, y: 2, z: 3 });
      expect(calledWith.isRunning).toBe(true);
      expect(calledWith.animation).toBe("forward");
    });

    it("respects throttle timing", () => {
      const publisher = vi.fn();

      useLocalPlayerStore.getState().sendMovement(publisher);
      useLocalPlayerStore.getState().sendMovement(publisher);

      expect(publisher).toHaveBeenCalledOnce();
    });
  });

  describe("teleport", () => {
    it("sets pendingTeleport with position only", () => {
      const pos = new Vector3(10, 20, 30);
      useLocalPlayerStore.getState().teleport(pos);

      const { pendingTeleport } = useLocalPlayerStore.getState();
      expect(pendingTeleport?.position).toEqual(pos);
      expect(pendingTeleport?.rotation).toBeUndefined();
    });

    it("sets pendingTeleport with position and rotation", () => {
      const pos = new Vector3(10, 20, 30);
      const rot = new Euler(0.1, 0.2, 0.3);
      useLocalPlayerStore.getState().teleport(pos, rot);

      const { pendingTeleport } = useLocalPlayerStore.getState();
      expect(pendingTeleport?.position).toEqual(pos);
      expect(pendingTeleport?.rotation).toEqual(rot);
    });
  });

  describe("FPV", () => {
    it("setIsFPV sets the value", () => {
      useLocalPlayerStore.getState().setIsFPV(true);
      expect(useLocalPlayerStore.getState().isFPV).toBe(true);
    });

    it("toggleFPV inverts the value", () => {
      expect(useLocalPlayerStore.getState().isFPV).toBe(false);

      useLocalPlayerStore.getState().toggleFPV();
      expect(useLocalPlayerStore.getState().isFPV).toBe(true);

      useLocalPlayerStore.getState().toggleFPV();
      expect(useLocalPlayerStore.getState().isFPV).toBe(false);
    });
  });

  describe("hasJoinedWorld", () => {
    it("sets hasJoinedWorld", () => {
      useLocalPlayerStore.getState().setHasJoinedWorld(true);
      expect(useLocalPlayerStore.getState().hasJoinedWorld).toBe(true);
    });
  });

  describe("reset", () => {
    it("resets to initial state", () => {
      const {
        setSessionId,
        setUsername,
        setIsRunning,
        setHasJoinedWorld,
        reset,
      } = useLocalPlayerStore.getState();

      setSessionId("test");
      setUsername("User");
      setIsRunning(true);
      setHasJoinedWorld(true);

      reset();

      const state = useLocalPlayerStore.getState();
      expect(state.sessionId).toBe("");
      expect(state.username).toBe("Anonymous");
      expect(state.isRunning).toBe(false);
      expect(state.hasJoinedWorld).toBe(false);
    });
  });
});
