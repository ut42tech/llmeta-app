import { Vector3 } from "three";
import { beforeEach, describe, expect, it } from "vitest";
import { useWorldStore } from "@/stores/worldStore";

describe("useWorldStore", () => {
  beforeEach(() => {
    useWorldStore.getState().resetConnection();
    useWorldStore.setState({ contentItems: [] });
  });

  describe("initial state", () => {
    it("has correct initial state", () => {
      const state = useWorldStore.getState();
      expect(state.instanceId).toBe(null);
      expect(state.contentItems).toEqual([]);
      expect(state.connection.status).toBe("idle");
      expect(state.connection.error).toBeUndefined();
    });
  });

  describe("instanceId management", () => {
    it("sets instanceId", () => {
      const { setInstanceId } = useWorldStore.getState();

      setInstanceId("uuid-123");
      expect(useWorldStore.getState().instanceId).toBe("uuid-123");
    });

    it("clears instanceId", () => {
      const { setInstanceId } = useWorldStore.getState();

      setInstanceId("uuid-123");
      setInstanceId(null);
      expect(useWorldStore.getState().instanceId).toBe(null);
    });
  });

  describe("content items", () => {
    it("adds content item with timestamp", () => {
      const { addContentItem } = useWorldStore.getState();
      const beforeAdd = Date.now();

      addContentItem({
        id: "content-1",
        position: new Vector3(1, 2, 3),
        image: { url: "https://example.com/img.png", prompt: "A cat" },
        username: "user1",
      });

      const { contentItems } = useWorldStore.getState();
      expect(contentItems).toHaveLength(1);
      expect(contentItems[0].id).toBe("content-1");
      expect(contentItems[0].createdAt).toBeGreaterThanOrEqual(beforeAdd);
    });

    it("removes content item by id", () => {
      const { addContentItem, removeContentItem } = useWorldStore.getState();

      addContentItem({
        id: "content-1",
        position: new Vector3(0, 0, 0),
        image: { url: "https://example.com/1.png" },
      });

      removeContentItem("content-1");
      expect(useWorldStore.getState().contentItems).toHaveLength(0);
    });

    it("does not remove non-existent item", () => {
      const { addContentItem, removeContentItem } = useWorldStore.getState();

      addContentItem({
        id: "content-1",
        position: new Vector3(0, 0, 0),
        image: { url: "https://example.com/1.png" },
      });

      removeContentItem("non-existent");
      expect(useWorldStore.getState().contentItems).toHaveLength(1);
    });
  });

  describe("connection state", () => {
    it("transitions to connecting", () => {
      const { setConnecting } = useWorldStore.getState();

      setConnecting();

      const { connection } = useWorldStore.getState();
      expect(connection.status).toBe("connecting");
      expect(connection.error).toBeUndefined();
    });

    it("transitions to connected", () => {
      const { setConnecting, setConnected } = useWorldStore.getState();

      setConnecting();
      setConnected();

      const { connection } = useWorldStore.getState();
      expect(connection.status).toBe("connected");
      expect(connection.error).toBeUndefined();
    });

    it("transitions to failed with error", () => {
      const { setConnecting, setFailed } = useWorldStore.getState();

      setConnecting();
      setFailed("Connection timeout");

      const { connection } = useWorldStore.getState();
      expect(connection.status).toBe("failed");
      expect(connection.error).toBe("Connection timeout");
    });

    it("transitions to failed without error", () => {
      const { setFailed } = useWorldStore.getState();

      setFailed();

      const { connection } = useWorldStore.getState();
      expect(connection.status).toBe("failed");
      expect(connection.error).toBeUndefined();
    });

    it("transitions to disconnected preserving error", () => {
      const { setFailed, setDisconnected } = useWorldStore.getState();

      setFailed("Some error");
      setDisconnected();

      const { connection } = useWorldStore.getState();
      expect(connection.status).toBe("disconnected");
      expect(connection.error).toBe("Some error");
    });

    it("resets connection and instanceId", () => {
      const { setInstanceId, setConnected, resetConnection } =
        useWorldStore.getState();

      setInstanceId("uuid-123");
      setConnected();
      resetConnection();

      const state = useWorldStore.getState();
      expect(state.instanceId).toBe(null);
      expect(state.connection.status).toBe("idle");
      expect(state.connection.error).toBeUndefined();
    });
  });

  describe("connection flow", () => {
    it("follows typical connection lifecycle", () => {
      const {
        setInstanceId,
        setConnecting,
        setConnected,
        setDisconnected,
        resetConnection,
      } = useWorldStore.getState();

      // Join instance
      setInstanceId("world-uuid-456");
      expect(useWorldStore.getState().instanceId).toBe("world-uuid-456");

      // Start connecting
      setConnecting();
      expect(useWorldStore.getState().connection.status).toBe("connecting");

      // Connected
      setConnected();
      expect(useWorldStore.getState().connection.status).toBe("connected");

      // Disconnect
      setDisconnected();
      expect(useWorldStore.getState().connection.status).toBe("disconnected");

      // Reset
      resetConnection();
      expect(useWorldStore.getState().instanceId).toBe(null);
      expect(useWorldStore.getState().connection.status).toBe("idle");
    });
  });
});
