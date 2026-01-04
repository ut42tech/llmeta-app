import { describe, expect, it } from "vitest";
import { boneMap } from "@/utils/bone-map";

describe("boneMap", () => {
  describe("structure", () => {
    it("contains all major body bones", () => {
      const majorBones = ["hips", "spine", "chest", "neck", "head"];

      const values = Object.values(boneMap);
      for (const bone of majorBones) {
        expect(values).toContain(bone);
      }
    });

    it("contains all left arm bones", () => {
      const leftArmBones = [
        "leftShoulder",
        "leftUpperArm",
        "leftLowerArm",
        "leftHand",
      ];

      const values = Object.values(boneMap);
      for (const bone of leftArmBones) {
        expect(values).toContain(bone);
      }
    });

    it("contains all right arm bones", () => {
      const rightArmBones = [
        "rightShoulder",
        "rightUpperArm",
        "rightLowerArm",
        "rightHand",
      ];

      const values = Object.values(boneMap);
      for (const bone of rightArmBones) {
        expect(values).toContain(bone);
      }
    });

    it("contains all left leg bones", () => {
      const leftLegBones = [
        "leftUpperLeg",
        "leftLowerLeg",
        "leftFoot",
        "leftToes",
      ];

      const values = Object.values(boneMap);
      for (const bone of leftLegBones) {
        expect(values).toContain(bone);
      }
    });

    it("contains all right leg bones", () => {
      const rightLegBones = [
        "rightUpperLeg",
        "rightLowerLeg",
        "rightFoot",
        "rightToes",
      ];

      const values = Object.values(boneMap);
      for (const bone of rightLegBones) {
        expect(values).toContain(bone);
      }
    });
  });

  describe("blender naming convention", () => {
    it("all keys start with DEF- prefix", () => {
      for (const key of Object.keys(boneMap)) {
        expect(key.startsWith("DEF-")).toBe(true);
      }
    });

    it("left side bones end with L", () => {
      const leftBones = Object.entries(boneMap).filter(([, value]) =>
        value.startsWith("left"),
      );

      for (const [key] of leftBones) {
        expect(key.endsWith("L")).toBe(true);
      }
    });

    it("right side bones end with R", () => {
      const rightBones = Object.entries(boneMap).filter(([, value]) =>
        value.startsWith("right"),
      );

      for (const [key] of rightBones) {
        expect(key.endsWith("R")).toBe(true);
      }
    });
  });

  describe("finger bones", () => {
    it("has all left hand finger bones", () => {
      const leftFingers = [
        "leftThumbMetacarpal",
        "leftThumbProximal",
        "leftThumbDistal",
        "leftIndexProximal",
        "leftIndexIntermediate",
        "leftIndexDistal",
        "leftMiddleProximal",
        "leftMiddleIntermediate",
        "leftMiddleDistal",
        "leftRingProximal",
        "leftRingIntermediate",
        "leftRingDistal",
        "leftLittleProximal",
        "leftLittleIntermediate",
        "leftLittleDistal",
      ];

      const values = Object.values(boneMap);
      for (const bone of leftFingers) {
        expect(values).toContain(bone);
      }
    });

    it("has all right hand finger bones", () => {
      const rightFingers = [
        "rightThumbMetacarpal",
        "rightThumbProximal",
        "rightThumbDistal",
        "rightIndexProximal",
        "rightIndexIntermediate",
        "rightIndexDistal",
        "rightMiddleProximal",
        "rightMiddleIntermediate",
        "rightMiddleDistal",
        "rightRingProximal",
        "rightRingIntermediate",
        "rightRingDistal",
        "rightLittleProximal",
        "rightLittleIntermediate",
        "rightLittleDistal",
      ];

      const values = Object.values(boneMap);
      for (const bone of rightFingers) {
        expect(values).toContain(bone);
      }
    });
  });

  describe("specific mappings", () => {
    it("maps hips correctly", () => {
      expect(boneMap["DEF-hips"]).toBe("hips");
    });

    it("maps head correctly", () => {
      expect(boneMap["DEF-head"]).toBe("head");
    });

    it("maps left hand correctly", () => {
      expect(boneMap["DEF-handL"]).toBe("leftHand");
    });

    it("maps right foot correctly", () => {
      expect(boneMap["DEF-footR"]).toBe("rightFoot");
    });
  });
});
